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
  Bell,
  HelpCircle,
  FolderKanban,
  Plus,
} from "lucide-react";
import { createTaskDefaults } from "@/data/tasks";
import { workspaceInfo } from "@/data/notifications";

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
            {/* REPLACEMENT 1: raw <button> "New Project" → Button component */}
            <Button className="w-full" size="lg">
              <Plus className="w-4 h-4" /> New Project
            </Button>
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
            {/* REPLACEMENT 2: raw <button> close modal → Button variant="ghost" size="icon" */}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title Input */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Task Title <span className="text-rose-500">*</span>
              </label>
              {/* REPLACEMENT 3: raw <input type="text"> title → Input component */}
              <Input
                type="text"
                required
                placeholder="E.g., Update user authentication flow"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full border-primary text-xs font-semibold"
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
                  {/* REPLACEMENT 4: raw <button> formatting toolbar buttons → Button variant="ghost" size="icon-xs" */}
                  <Button type="button" variant="ghost" size="icon-xs">
                    <Bold className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs">
                    <Italic className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs">
                    <List className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs">
                    <Link2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {/* REPLACEMENT 5: raw <textarea> description → Textarea component */}
                <Textarea
                  rows={4}
                  placeholder="Add detailed context, acceptance criteria, or technical notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none resize-none border-0 rounded-none"
                />
              </div>
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Status
                </label>
                {/* REPLACEMENT 6: raw <select> status → Select component */}
                <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                  <SelectTrigger className="w-full text-xs font-semibold">
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
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Priority
                </label>
                {/* REPLACEMENT 7: raw <select> priority → Select component */}
                <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                  <SelectTrigger className="w-full text-xs font-semibold">
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
              </div>
            </div>

            {/* Assignee & Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Assignee
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-2.5 w-5 h-5 rounded-full bg-muted-foreground/30 overflow-hidden flex items-center justify-center text-[10px] font-bold text-foreground z-10">
                    {createTaskDefaults.defaultAssigneeInitials}
                  </div>
                  {/* REPLACEMENT 8: raw <input type="text"> assignee → Input component */}
                  <Input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full pl-9 pr-8 text-xs font-semibold border-border"
                  />
                  {/* REPLACEMENT 9: raw <button> add assignee → Button variant="ghost" size="icon-xs" */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute right-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                  Due Date
                </label>
                {/* REPLACEMENT 10: raw <input type="text"> due date → Input component with Calendar icon */}
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 text-xs font-medium"
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
                  /* REPLACEMENT 11: raw <span> tag pills → Badge variant="outline" */
                  <Badge key={tag} variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
                    {tag}
                    {/* REPLACEMENT 12: raw <button> remove tag → Button variant="ghost" size="icon-xs" */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                {/* REPLACEMENT 13: raw <input type="text"> tag input → Input component */}
                <Input
                  type="text"
                  placeholder={tags.length === 0 ? "Add tag..." : "Add tag..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 bg-transparent border-0 text-xs font-medium placeholder:text-muted-foreground focus-visible:ring-0 min-w-20 h-auto p-0"
                />
              </div>
            </div>

            {/* Blocks / Blocked By Dependencies Field */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-1.5">
                Blocks / Blocked By
              </label>
              {/* REPLACEMENT 14: raw <input type="text"> dependency search → Input component with Search icon */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search tasks by ID or name (e.g., TSK-102)"
                  value={blockedQuery}
                  onChange={(e) => setBlockedQuery(e.target.value)}
                  className="w-full pl-9 text-xs font-medium"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              {/* REPLACEMENT 15: raw <button> "Cancel" → Button variant="ghost" */}
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              {/* REPLACEMENT 16: raw <button> "Create Task" → Button (default variant) */}
              <Button type="submit">
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
