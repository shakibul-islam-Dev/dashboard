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

interface CreateTaskModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

export default function CreateTaskModal({
  isOpen = true,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState("Sarah Chen");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>(["Frontend", "Design System"]);
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
    <div className="relative w-full min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Background App Dashboard Mockup (Blurred Under Modal Overlay) */}
      <div className="flex h-screen overflow-hidden filter blur-xs select-none pointer-events-none">
        {/* Sidebar */}
        <div className="w-64 bg-slate-700 text-slate-200 p-4 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-slate-400/30" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Acme Development
                </h3>
                <p className="text-[11px] text-slate-400">Enterprise Plan</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-600/80 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> New Project
            </button>
            <div className="mt-6 space-y-2">
              <div className="p-2 bg-slate-600/50 rounded-lg text-xs flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-slate-300" /> Projects
              </div>
            </div>
          </div>
        </div>

        {/* Top Header & Main Workspace Area */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-bold text-slate-800">TaskBoard</span>
              <nav className="flex gap-4 text-xs font-medium text-slate-500">
                <span>Views</span>
                <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-4">
                  Board
                </span>
                <span>Timeline</span>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Search className="w-4 h-4" />
              <Bell className="w-4 h-4" />
              <HelpCircle className="w-4 h-4" />
              <div className="w-7 h-7 rounded-full bg-slate-300" />
            </div>
          </header>
        </div>
      </div>

      {/* Modal Overlay Context */}
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
        {/* Modal Window Container */}
        <div className="w-full max-w-135 bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-base font-bold text-slate-900">Create Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Update user authentication flow"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-blue-600 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden ring-2 ring-blue-500/20"
              />
            </div>

            {/* Description with Rich Editor Toolbar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                Description
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-blue-500 transition-colors">
                {/* Editor Formatting Bar */}
                <div className="flex items-center gap-3 px-3 py-1.5 border-b border-slate-100 bg-slate-50/50 text-slate-600">
                  <button type="button" className="hover:text-slate-900">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-slate-900">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-slate-900">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-slate-900">
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Add detailed context, acceptance criteria, or technical notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden resize-none"
                />
              </div>
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500 pr-8"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Done</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500 pr-8"
                  >
                    <option>Medium</option>
                    <option>Low</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Assignee & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Assignee
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-2.5 w-5 h-5 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-700">
                    SC
                  </div>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tags Pill Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                Tags
              </label>
              <div className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex flex-wrap items-center gap-2 focus-within:border-blue-500 min-h-9.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-semibold border border-blue-100"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900 cursor-pointer"
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
                  className="flex-1 bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden min-w-20"
                />
              </div>
            </div>

            {/* Blocks / Blocked By Dependencies Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                Blocks / Blocked By
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks by ID or name (e.g., TSK-102)"
                  value={blockedQuery}
                  onChange={(e) => setBlockedQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
