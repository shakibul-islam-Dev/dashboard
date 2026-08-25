"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MoreVertical,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ChevronDown,
  Calendar,
  Plus,
  Ban,
  Loader2,
} from "lucide-react";
import { editTaskDefaults, type Subtask } from "@/data/tasks";
import { toast } from "sonner";

/* ─── shadcn UI imports ─── */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/* ── localStorage key ── */
const LS_EDITS_KEY = "dashboard_edited_tasks";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTaskModal({ isOpen, onClose }: EditTaskModalProps) {
  // ── Form State ─────────────────────────────────────────────────────────────
  const [taskTitle, setTaskTitle] = useState(editTaskDefaults.title);
  const [description, setDescription] = useState(editTaskDefaults.description);
  const [status, setStatus] = useState(editTaskDefaults.status);
  const [priority, setPriority] = useState(editTaskDefaults.priority);
  const [assignee] = useState(editTaskDefaults.assignee);
  const [dueDate, setDueDate] = useState(editTaskDefaults.dueDate);
  const [tags, setTags] = useState<string[]>(editTaskDefaults.tags);
  const [tagInput, setTagInput] = useState("");

  const [subtasks, setSubtasks] = useState<Subtask[]>([
    ...editTaskDefaults.subtasks,
  ]);

  // ── Subtask Inline Editing ─────────────────────────────────────────────────
  const [editSubtaskId, setEditSubtaskId] = useState<string | null>(null);
  const [editSubtaskValue, setEditSubtaskValue] = useState("");

  // ── Dependency Visibility ──────────────────────────────────────────────────
  const [hasDependency, setHasDependency] = useState(true);

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

  // ── Subtask Helpers ────────────────────────────────────────────────────────
  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st,
      ),
    );
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: "New Subtask",
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const startEditSubtask = (subtask: Subtask) => {
    setEditSubtaskId(subtask.id);
    setEditSubtaskValue(subtask.title);
  };

  const commitEditSubtask = () => {
    if (editSubtaskId === null) return;
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === editSubtaskId
          ? { ...st, title: editSubtaskValue.trim() || st.title }
          : st,
      ),
    );
    setEditSubtaskId(null);
    setEditSubtaskValue("");
  };

  // ── Tag Helpers ────────────────────────────────────────────────────────────
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
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

  // ── Save Handler: validates, persists edits to localStorage, shows toast ─────
  const handleSave = async () => {
    if (!taskTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const editedTask = {
      id: editTaskDefaults.code,
      title: taskTitle.trim(),
      description,
      status,
      priority,
      assignee,
      dueDate,
      tags,
      subtasks,
      updatedAt: new Date().toISOString(),
    };

    // Persist edits to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(LS_EDITS_KEY) || "{}");
      existing[editedTask.id] = editedTask;
      localStorage.setItem(LS_EDITS_KEY, JSON.stringify(existing));
    } catch {
      /* localStorage unavailable – ignore */
    }

    setIsSubmitting(false);
    toast.success("Changes saved", {
      description: `"${editedTask.title}" has been updated.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {editTaskDefaults.code}
            </span>
            <h2 className="text-base font-bold text-foreground">Edit Task</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        {/* Modal Body - 2 Column Layout */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left Main Content Column */}
          <div className="md:col-span-7 space-y-5">
            {/* Task Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Task Title
              </label>
              <Input
                type="text"
                value={taskTitle}
                onChange={(e) => {
                  setTaskTitle(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Description
              </label>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                {/* Editor Toolbar */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted text-muted-foreground">
                  <Button variant="ghost" size="icon" type="button">
                    <Bold className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button">
                    <Italic className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button">
                    <List className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </Button>
                  <div className="w-px h-3.5 bg-muted" />
                  <Button variant="ghost" size="icon" type="button">
                    <Link2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-0 rounded-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Subtasks
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddSubtask}
                  className="text-xs font-medium text-primary gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Subtask
                </Button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 border border-border rounded-lg px-3 py-2 bg-card"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                    />
                    {/* Subtitle: click to edit inline */}
                    {editSubtaskId === subtask.id ? (
                      <Input
                        type="text"
                        value={editSubtaskValue}
                        onChange={(e) => setEditSubtaskValue(e.target.value)}
                        onBlur={commitEditSubtask}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEditSubtask();
                          if (e.key === "Escape") {
                            setEditSubtaskId(null);
                            setEditSubtaskValue("");
                          }
                        }}
                        autoFocus
                        className="text-xs h-auto py-0 border-0 shadow-none focus-visible:ring-0 flex-1"
                      />
                    ) : (
                      <span
                        onClick={() => startEditSubtask(subtask)}
                        className={`text-xs font-medium cursor-pointer flex-1 ${
                          subtask.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Properties Sidebar Column */}
          <div className="md:col-span-5 space-y-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Status
              </label>
              <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Priority
              </label>
              <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Assignee
              </label>
              <div className="relative">
                <div className="w-full bg-card border border-border rounded-lg px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-muted text-foreground font-semibold text-[9px] flex items-center justify-center">
                      {editTaskDefaults.assigneeInitials}
                    </div>
                    <span className="text-xs text-foreground font-medium">
                      {assignee}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Due Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Tags
              </label>
              <div className="border border-border rounded-lg p-2 bg-card space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-muted-foreground -mr-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag..."
                  className="border-0 shadow-none focus-visible:ring-0 text-xs px-0 pt-1 h-auto"
                />
              </div>
            </div>

            {/* Blocks / Blocked By */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Blocks / Blocked By
              </label>
              <div className="border border-border rounded-lg p-2 bg-card space-y-2">
                {hasDependency && (
                  <div className="inline-flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 text-foreground rounded p-1.5 text-xs w-full justify-between">
                    <div className="flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {editTaskDefaults.blockedBy.code}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate max-w-27.5">
                        {editTaskDefaults.blockedBy.title}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-muted-foreground"
                      onClick={() => setHasDependency(false)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1 pt-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Add Dependency</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
