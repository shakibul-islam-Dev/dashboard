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
} from "lucide-react";
import { editTaskDefaults, type Subtask } from "@/data/tasks";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTaskModal({ isOpen, onClose }: EditTaskModalProps) {
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

  // Handle Escape key to close modal
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
            <button className="hover:text-muted-foreground p-1 rounded-md hover:bg-muted transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="hover:text-muted-foreground p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
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
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Description
              </label>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                {/* Editor Toolbar */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted text-muted-foreground">
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
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3.5 bg-muted" />
                  <button type="button" className="hover:text-foreground">
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Subtasks
                </label>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="text-xs font-medium text-primary hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Subtask
                </button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 border border-border rounded-lg px-3 py-2 bg-card"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-ring border-border"
                    />
                    <span
                      className={`text-xs font-medium ${
                        subtask.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {subtask.title}
                    </span>
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
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground appearance-none focus:outline-none focus:border-primary pr-8"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground appearance-none focus:outline-none focus:border-primary pr-8"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
              <div className="relative flex items-center border border-border rounded-lg px-3 py-2 bg-card">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground focus:outline-none"
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
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-muted text-foreground text-xs font-medium px-2 py-0.5 rounded"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-muted-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag..."
                  className="w-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none pt-1"
                />
              </div>
            </div>

            {/* Blocks / Blocked By */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Blocks / Blocked By
              </label>
              <div className="border border-border rounded-lg p-2 bg-card space-y-2">
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
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-muted-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 pt-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Add Dependency</span>
                </button>
              </div>
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
