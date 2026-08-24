"use client";

import React, { useState } from "react";
import {
  X,
  Bold,
  Italic,
  List,
  Link2,
  Calendar,
  UserPlus,
  Search,
  ChevronDown,
  Bell,
  HelpCircle,
  FolderKanban,
  Plus,
} from "lucide-react";
import { createTaskDefaults } from "@/data/tasks";
import { workspaceInfo } from "@/data/notifications";

interface CreateTaskModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: Record<string, string | string[]>) => void;
}

export default function CreateTaskModal({
  isOpen = true,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(createTaskDefaults.statuses[0]);
  const [priority, setPriority] = useState(createTaskDefaults.priorities[1]);
  const [assignee, setAssignee] = useState(
    createTaskDefaults.defaultAssignee,
  );
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>(createTaskDefaults.defaultTags);
  const [tagInput, setTagInput] = useState("");
  const [blockedQuery, setBlockedQuery] = useState("");

  if (!isOpen) return null;

  const handleRemoveTag = (tagToRemove: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        taskTitle,
        description,
        status,
        priority,
        assignee,
        dueDate,
        tags,
        blockedQuery,
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full min-h-screen bg-muted font-sans text-foreground">
      {/* Background App Dashboard Mockup (Blurred Under Modal Overlay) */}
      <div className="flex h-screen overflow-hidden filter blur-xs select-none pointer-events-none">
        {/* Sidebar */}
        <div className="w-40 sm:w-64 bg-foreground text-background p-4 space-y-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-background/20" />
              <div>
                <h3 className="font-bold text-background text-sm">
                  {workspaceInfo.name}
                </h3>
                <p className="text-[11px] text-background/60">
                  {workspaceInfo.plan}
                </p>
              </div>
            </div>
            <button className="w-full py-2 bg-primary/80 text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> New Project
            </button>
            <div className="mt-6 space-y-2">
              <div className="p-2 bg-background/10 rounded-lg text-xs flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-background/70" /> Projects
              </div>
            </div>
          </div>
        </div>

        {/* Top Header & Main Workspace Area */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-bold text-foreground">TaskBoard</span>
              <nav className="flex gap-4 text-xs font-medium text-muted-foreground">
                <span>Views</span>
                <span className="text-primary font-semibold border-b-2 border-primary pb-4">
                  Board
                </span>
                <span>Timeline</span>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Search className="w-4 h-4" />
              <Bell className="w-4 h-4" />
              <HelpCircle className="w-4 h-4" />
              <div className="w-7 h-7 rounded-full bg-muted-foreground/30" />
            </div>
          </header>
        </div>
      </div>

      {/* Modal Overlay Context */}
      <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-2xs flex items-center justify-center p-4">
        {/* Modal Window Container */}
        <div className="w-full max-w-135 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
            <h2 className="text-base font-bold text-foreground">Create Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title Input */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Update user authentication flow"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-card border border-primary rounded-lg text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden ring-2 ring-ring/20"
              />
            </div>

            {/* Description with Rich Editor Toolbar */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Description
              </label>
              <div className="border border-border rounded-lg overflow-hidden bg-card focus-within:border-primary transition-colors">
                {/* Editor Formatting Bar */}
                <div className="flex items-center gap-3 px-3 py-1.5 border-b border-border bg-muted/50 text-muted-foreground">
                  <button type="button" className="hover:text-foreground">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-foreground">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-foreground">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-foreground">
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Add detailed context, acceptance criteria, or technical notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden resize-none"
                />
              </div>
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-hidden focus:border-primary pr-8"
                  >
                    {createTaskDefaults.statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-hidden focus:border-primary pr-8"
                  >
                    {createTaskDefaults.priorities.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Assignee & Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Assignee
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-2.5 w-5 h-5 rounded-full bg-muted-foreground/30 overflow-hidden flex items-center justify-center text-[10px] font-bold text-foreground">
                    {createTaskDefaults.defaultAssigneeInitials}
                  </div>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-hidden focus:border-primary"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 px-3.5 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Tags Pill Input */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Tags
              </label>
              <div className="w-full px-3 py-1.5 bg-card border border-border rounded-lg flex flex-wrap items-center gap-2 focus-within:border-primary min-h-9.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-semibold border border-primary/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={tags.length === 0 ? "Add tag..." : "Add tag..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden min-w-20"
                />
              </div>
            </div>

            {/* Blocks / Blocked By Dependencies Field */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Blocks / Blocked By
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks by ID or name (e.g., TSK-102)"
                  value={blockedQuery}
                  onChange={(e) => setBlockedQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-card hover:bg-muted text-muted-foreground text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-primary-foreground rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
