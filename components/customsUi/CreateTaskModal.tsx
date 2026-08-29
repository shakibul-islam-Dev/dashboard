"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Bold,
  Italic,
  List,
  Link2,
  UserPlus,
  Calendar,
  Search,
  Loader2,
} from "lucide-react";
import { createTaskDefaults } from "@/data/tasks";
import { projectsPageData } from "@/data/projects";
import { useCustomTasks, useCustomProjects, type CustomTask } from "@/lib/customStore";
import { toast } from "sonner";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";

// shadcn UI Components
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
import { Badge } from "@/components/ui/badge";

/* ── localStorage key for persisted tasks (managed by lib/customStore) ── */

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
}

interface TaskFormValues {
  taskTitle: string;
  description: string;
  project: string;
  status: string;
  priority: string;
  dueDate: string;
}

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

export default function CreateTaskModal({
  isOpen,
  onClose,
  defaultProject,
}: CreateTaskModalProps) {
  // ── Reactive store: pushes the new task to every listening UI ──
  const { addTask } = useCustomTasks();
  const customProjects = useCustomProjects().projects;

  // ── React Hook Form ─────────────────────────────────────────────────────────
  const projectOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...projectsPageData.map((p) => p.title),
          ...customProjects.map((p) => p.name),
          "General",
        ]),
      ),
    [customProjects],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      taskTitle: "",
      description: "",
      project: defaultProject ?? "General",
      status: createTaskDefaults.statuses[0],
      priority: createTaskDefaults.priorities[1],
      dueDate: "",
    },
  });

  // ── Non-form UI state ───────────────────────────────────────────────────────
  const [assignee] = useState(createTaskDefaults.defaultAssignee);
  const [tags, setTags] = useState<string[]>(createTaskDefaults.defaultTags);
  const [tagInput, setTagInput] = useState("");
  const [dependencySearch, setDependencySearch] = useState("");
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

  // ── Tag Helpers ────────────────────────────────────────────────────────────
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // ── Form Submission: validates, persists to localStorage, shows toast ───────
  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    setIsSubmitting(true);

    // Simulate a brief network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newTask: CustomTask = {
      id: `TASK-${crypto.randomUUID()}`,
      title: data.taskTitle.trim(),
      description: data.description,
      project: data.project,
      status: data.status,
      priority: data.priority,
      assignee,
      dueDate: data.dueDate,
      tags,
      dependency: dependencySearch.trim() || null,
      createdAt: new Date().toISOString(),
    };

    // Persist + notify all mounted UI (My Tasks, Dashboard, ...)
    addTask(newTask);

    setIsSubmitting(false);
    toast.success("Task created", {
      description: `"${newTask.title}" has been added to your tasks.`,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop / Dark Overlay */}
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-xs"
            onClick={onClose}
            {...backdropMotion}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-xl bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border"
            {...cardMotion}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Create Task</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Task Title */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    aria-invalid={!!errors.taskTitle}
                    {...register("taskTitle", {
                      required: "Task title is required",
                    })}
                    placeholder="E.g., Update user authentication flow"
                    autoFocus
                    className={errors.taskTitle ? "border-destructive" : ""}
                  />
                  {errors.taskTitle && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-500 font-medium"
                    >
                      {errors.taskTitle.message}
                    </motion.p>
                  )}
                </div>

                {/* Description with Rich Text Toolbar Header */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                    {/* Simple Formatting Bar */}
                    <div className="flex items-center gap-3 px-3 py-1.5 border-b border-border bg-muted text-muted-foreground">
                      <Button variant="ghost" size="icon" type="button" className="p-0.5 h-auto">
                        <Bold className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button" className="p-0.5 h-auto">
                        <Italic className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button" className="p-0.5 h-auto">
                        <List className="w-3.5 h-3.5" />
                      </Button>
                      <div className="w-px h-3.5 bg-muted" />
                      <Button variant="ghost" size="icon" type="button" className="p-0.5 h-auto">
                        <Link2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {/* Description Textarea */}
                    <Textarea
                      rows={3}
                      {...register("description")}
                      placeholder="Add detailed context, acceptance criteria, or technical notes..."
                      className="bg-card border-0 focus-visible:ring-0 resize-none rounded-none"
                    />
                  </div>
                </div>

                {/* Status & Priority Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {createTaskDefaults.statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Priority
                    </label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {createTaskDefaults.priorities.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Assignee & Due Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Project */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Project
                    </label>
                    <Controller
                      control={control}
                      name="project"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectOptions.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Assignee */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Assignee
                    </label>
                    <div className="flex items-center justify-between border border-border rounded-lg px-3 py-1.5 bg-card">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted text-foreground font-semibold text-[9px] flex items-center justify-center shrink-0">
                          {createTaskDefaults.defaultAssigneeInitials}
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {assignee}
                        </span>
                      </div>
                      <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Due Date
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 shrink-0 pointer-events-none" />
                      <Input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        {...register("dueDate")}
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </label>
                  <div className="border border-border rounded-lg p-2 bg-card flex flex-wrap items-center gap-2 min-h-10.5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {tags.map((tag) => (
                        <motion.div
                          key={tag}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        >
                          <Badge variant="outline" className="gap-1.5 font-medium">
                            {tag}
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="h-3 w-3 p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag..."
                      className="bg-transparent border-0 focus-visible:ring-0 flex-1 min-w-20 text-xs h-auto p-0 shadow-none"
                    />
                  </div>
                </div>

                {/* Blocks / Blocked By */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Blocks / Blocked By
                  </label>
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 shrink-0 pointer-events-none" />
                    <Input
                      type="text"
                      value={dependencySearch}
                      onChange={(e) => setDependencySearch(e.target.value)}
                      placeholder="Search tasks by ID or name (e.g., TSK-102)"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
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