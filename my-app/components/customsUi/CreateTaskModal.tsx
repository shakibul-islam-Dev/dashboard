"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Bold,
  Italic,
  List,
  Link2,
  ChevronDown,
  UserPlus,
  Calendar,
  Search,
} from "lucide-react";
import { createTaskDefaults } from "@/data/tasks";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(createTaskDefaults.statuses[0]);
  const [priority, setPriority] = useState(createTaskDefaults.priorities[1]);
  const [assignee] = useState(createTaskDefaults.defaultAssignee);
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>(createTaskDefaults.defaultTags);
  const [tagInput, setTagInput] = useState("");
  const [dependencySearch, setDependencySearch] = useState("");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop / Dark Overlay */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Create Task</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-muted-foreground transition-colors p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Task Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="E.g., Update user authentication flow"
              className="w-full bg-card border border-primary rounded-lg px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              autoFocus
            />
          </div>

          {/* Description with Rich Text Toolbar Header */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
              {/* Simple Formatting Bar */}
              <div className="flex items-center gap-3 px-3 py-1.5 border-b border-border bg-muted text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground p-0.5 rounded transition-colors"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="hover:text-foreground p-0.5 rounded transition-colors"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="hover:text-foreground p-0.5 rounded transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-muted" />
                <button
                  type="button"
                  className="hover:text-foreground p-0.5 rounded transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add detailed context, acceptance criteria, or technical notes..."
                className="w-full bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
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
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-sm text-foreground appearance-none focus:outline-none focus:border-border pr-8"
                >
                  {createTaskDefaults.statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-sm text-foreground appearance-none focus:outline-none focus:border-border pr-8"
                >
                  {createTaskDefaults.priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="relative flex items-center border border-border rounded-lg px-3 py-1.5 bg-card">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
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
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-md border border-border/60"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-muted-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none flex-1 min-w-20"
              />
            </div>
          </div>

          {/* Blocks / Blocked By */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Blocks / Blocked By
            </label>
            <div className="relative flex items-center border border-border rounded-lg px-3 py-2 bg-card">
              <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                value={dependencySearch}
                onChange={(e) => setDependencySearch(e.target.value)}
                placeholder="Search tasks by ID or name (e.g., TSK-102)"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
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
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
