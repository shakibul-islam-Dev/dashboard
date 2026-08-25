"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Plus, Loader2 } from "lucide-react";
import { projectStatusOptions } from "@/data/tasks";
import { defaultProjectMembers, type MemberAvatar } from "@/data/team";
import { toast } from "sonner";

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

/* ── localStorage key ── */
const LS_PROJECTS_KEY = "dashboard_custom_projects";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// ──────────────────────────────────────────────────────────────────────────────
// CreateProjectModal
// ──────────────────────────────────────────────────────────────────────────────

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  // ── Form State ─────────────────────────────────────────────────────────────
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Team Members ───────────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<MemberAvatar[]>([
    ...defaultProjectMembers,
  ]);
  const [nextMemberIndex, setNextMemberIndex] = useState(0);

  // ── Validation & Submission State ──────────────────────────────────────────
  const [error, setError] = useState("");
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

  if (!isOpen) return null;

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
  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate a brief network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newProject = {
      id: `PRJ-${Date.now()}`,
      name: projectName.trim(),
      description,
      status,
      startDate,
      endDate,
      teamMembers,
      createdAt: new Date().toISOString(),
    };

    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(LS_PROJECTS_KEY) || "[]");
      existing.push(newProject);
      localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(existing));
    } catch {
      /* localStorage unavailable – ignore */
    }

    setIsSubmitting(false);
    toast.success("Project created", {
      description: `"${newProject.name}" has been added to your projects.`,
    });

    // Reset form and close
    setProjectName("");
    setDescription("");
    setStatus("Planning");
    setStartDate("");
    setEndDate("");
    setTeamMembers([...defaultProjectMembers]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Create Project</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set up a new workspace for your team.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-2 space-y-5">
          {/* ── Project Name ──────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., Q4 Enterprise Platform Redesign"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}
          </div>

          {/* ── Description ───────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              <Select value={status} onValueChange={(v) => v !== null && setStatus(v)}>
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                {teamMembers.map((member) => (
                  <div key={member.initials} className="relative group">
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
                  </div>
                ))}
              </div>

              {/* Add People button */}
              <Button
                variant="outline"
                size="sm"
                className="ml-1 border-dashed"
                onClick={handleAddMember}
              >
                <Plus className="w-3.5 h-3.5" />
                Add People
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 mt-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
