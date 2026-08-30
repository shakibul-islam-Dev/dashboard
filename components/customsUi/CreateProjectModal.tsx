"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Plus, Loader2 } from "lucide-react";
import { projectStatusOptions } from "@/data/tasks";
import { defaultProjectMembers, type MemberAvatar } from "@/data/team";
import {
  useCustomProjects,
  writeProjectEdit,
  nextProjectId,
  type CustomProject,
} from "@/lib/customStore";
import { toast } from "sonner";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";

// ── shadcn UI Components ──────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ── localStorage key (managed by lib/customStore) ── */

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface EditableProjectShape {
  id: string;
  isCustom: boolean;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  teamMembers: MemberAvatar[];
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editableProject?: EditableProjectShape | null;
}

interface ProjectFormValues {
  projectName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

// ── New member initials pool ─────────────────────────────────────────────────
const NEW_MEMBER_INITIALS = ["PK", "LH", "RN", "DW", "TM", "JS", "NB", "GF"];
const NEW_MEMBER_BGS = [
  "bg-indigo-200 text-indigo-700",
  "bg-teal-200 text-teal-700",
  "bg-rose-200 text-rose-700",
  "bg-amber-200 text-amber-700",
  "bg-sky-200 text-sky-700",
  "bg-violet-200 text-violet-700",
  "bg-lime-200 text-lime-700",
  "bg-orange-200 text-orange-700",
];

// ── Modal motion presets ─────────────────────────────────────────────────────
const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const cardMotion = {
  initial: { opacity: 0, scale: 0.92, y: 24 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// CreateProjectModal
// ──────────────────────────────────────────────────────────────────────────────

export default function CreateProjectModal({
  isOpen,
  onClose,
  editableProject,
}: CreateProjectModalProps) {
  // ── Reactive store: pushes the new project to every listening UI ──
  const { addProject, updateProject } = useCustomProjects();

  // ── React Hook Form ─────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      projectName: editableProject?.name ?? "",
      description: editableProject?.description ?? "",
      status: editableProject?.status ?? "Planning",
      startDate: editableProject?.startDate ?? "",
      endDate: editableProject?.endDate ?? "",
    },
  });

  // ── Team Members ───────────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<MemberAvatar[]>(
    editableProject && editableProject.teamMembers.length > 0
      ? [...editableProject.teamMembers]
      : [...defaultProjectMembers],
  );
  const [nextMemberIndex, setNextMemberIndex] = useState(0);

  // ── Submission State ────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Escape Key Handler ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // ── Team Member Helpers ────────────────────────────────────────────────────
  const handleAddMember = () => {
    const idx = nextMemberIndex % NEW_MEMBER_INITIALS.length;
    const newMember: MemberAvatar = {
      initials: NEW_MEMBER_INITIALS[idx],
      bg: NEW_MEMBER_BGS[idx],
    };
    setTeamMembers((prev) => [...prev, newMember]);
    setNextMemberIndex((prev) => prev + 1);
  };

  const handleRemoveMember = (initials: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.initials !== initials));
  };

  // ── Form Submission: validates, persists to localStorage, shows toast ────────
  // In-flight ref lock prevents a rapid double-submit from firing 2 toasts.
  const savingRef = useRef(false);
  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSubmitting(true);

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (editableProject) {
      // ── Edit mode: update the stored project (or patch the seeded one) ──
      if (editableProject.isCustom) {
        updateProject(editableProject.id, {
          name: data.projectName.trim(),
          description: data.description,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          teamMembers,
        });
      } else {
        writeProjectEdit(editableProject.id, {
          title: data.projectName.trim(),
          description: data.description,
          status: data.status,
        });
      }

      setIsSubmitting(false);
      savingRef.current = false;
      toast.success("Project updated", {
        description: `"${data.projectName.trim()}" has been updated.`,
      });
      onClose();
      return;
    }

    const newProject: CustomProject = {
      id: nextProjectId(),
      name: data.projectName.trim(),
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      teamMembers,
      createdAt: new Date().toISOString(),
    };

    // Persist + notify all mounted UI (Projects, Dashboard, ...)
    addProject(newProject);

    setIsSubmitting(false);
    savingRef.current = false;
    toast.success("Project created", {
      description: `"${newProject.name}" has been added to your projects.`,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-xs"
            onClick={onClose}
            {...backdropMotion}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border"
            {...cardMotion}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editableProject ? "Edit Project" : "Create Project"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editableProject
                    ? "Update the workspace details for your team."
                    : "Set up a new workspace for your team."}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body Content */}
            {/* eslint-disable-next-line react-hooks/refs -- the handler reads a ref
                in-flight guard; safe as it only runs on submit (event handler). */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-2 space-y-5">
                {/* ── Project Name ──────────────────────────────────────────── */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    aria-invalid={!!errors.projectName}
                    {...register("projectName", {
                      required: "Project name is required",
                    })}
                    placeholder="e.g., Q4 Enterprise Platform Redesign"
                    autoFocus
                    className={errors.projectName ? "border-destructive" : ""}
                  />
                  {errors.projectName && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-500 font-medium"
                    >
                      {errors.projectName.message}
                    </motion.p>
                  )}
                </div>

                {/* ── Description ───────────────────────────────────────────── */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </label>
                  <Textarea
                    rows={3}
                    {...register("description")}
                    placeholder="Briefly describe the goals and scope of this project..."
                    className="resize-none"
                  />
                </div>

                {/* ── Status & Timeline Row ────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  {/* Status Field */}
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v !== null && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectStatusOptions.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Timeline Field */}
                  <div className="sm:col-span-7 space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Timeline
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="mm/dd/yyyy"
                          {...register("startDate")}
                          className="pr-9"
                        />
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <span className="text-muted-foreground/60 font-light hidden sm:inline">
                        —
                      </span>
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="mm/dd/yyyy"
                          {...register("endDate")}
                          className="pr-9"
                        />
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Team Members Section ──────────────────────────────────── */}
                <div className="pt-2 border-t border-border">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Team Members
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Avatar Stack */}
                    <div className="flex -space-x-2 overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {teamMembers.map((member) => (
                          <motion.div
                            key={member.initials}
                            layout
                            initial={{ opacity: 0, scale: 0.5, x: -8 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: 8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className="relative group"
                          >
                            <Avatar className={member.bg}>
                              <AvatarFallback className="font-bold text-[10px]">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            {/* Remove button on hover */}
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.initials)}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold leading-none"
                            >
                              X
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Add People button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="ml-1 border-dashed"
                        onClick={handleAddMember}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add People
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 mt-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editableProject ? "Saving..." : "Creating..."}
                    </>
                  ) : editableProject ? (
                    "Save Changes"
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}