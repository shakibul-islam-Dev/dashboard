"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Calendar, Plus } from "lucide-react";
import { projectStatusOptions } from "@/data/tasks";
import { defaultProjectMembers } from "@/data/team";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Close modal on Escape key press
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
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-muted-foreground transition-colors p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-2 space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Q4 Enterprise Platform Redesign"
              className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the goals and scope of this project..."
              className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          {/* Status & Timeline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            {/* Status Field */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground appearance-none focus:outline-none focus:border-primary pr-8"
                >
                  {projectStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Timeline Field */}
            <div className="sm:col-span-7 space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Timeline
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="relative flex-1 flex items-center border border-border rounded-lg px-3 py-2 bg-card">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none pr-4"
                  />
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 absolute right-2.5" />
                </div>
                <span className="text-muted-foreground/60 font-light hidden sm:inline">
                  —
                </span>
                <div className="relative flex-1 flex items-center border border-border rounded-lg px-3 py-2 bg-card">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none pr-4"
                  />
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 absolute right-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="pt-2 border-t border-border">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Team Members
            </label>
            <div className="flex items-center gap-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2 overflow-hidden">
                {defaultProjectMembers.map((member) => (
                  <div
                    key={member.initials}
                    className={`inline-block h-7 w-7 rounded-full ring-2 ring-card ${member.bg} font-bold text-[10px] items-center justify-center`}
                  >
                    {member.initials}
                  </div>
                ))}
              </div>

              {/* Add People Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-border hover:border-muted-foreground/50 rounded-lg text-xs font-medium text-muted-foreground transition-colors ml-1"
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                Add People
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 mt-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg shadow-xs transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
