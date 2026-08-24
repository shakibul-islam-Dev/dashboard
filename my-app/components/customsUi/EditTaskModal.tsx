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

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export default function EditTaskModal({ isOpen, onClose }: EditTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("Implement authentication flow");
  const [description, setDescription] = useState(
    "Implement the complete authentication flow including login, registration and session handling.",
  );
  const [status, setStatus] = useState("In Progress");
  const [priority, setPriority] = useState("High");
  const [assignee, setAssignee] = useState("Alex Morgan");
  const [dueDate, setDueDate] = useState("Aug 28, 2024");
  const [tags, setTags] = useState<string[]>(["Frontend", "Authentication"]);
  const [tagInput, setTagInput] = useState("");

  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "1", title: "Design login UI", completed: true },
    { id: "2", title: "Implement JWT handling", completed: false },
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden font-sans text-slate-800 z-10 my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-400">
              TASK-124
            </span>
            <h2 className="text-base font-bold text-slate-900">Edit Task</h2>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Column Layout */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left Main Content Column */}
          <div className="md:col-span-7 space-y-5">
            {/* Task Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Description
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                {/* Editor Toolbar */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-200/80 bg-slate-50 text-slate-500">
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
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3.5 bg-slate-200" />
                  <button type="button" className="hover:text-slate-900">
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Subtasks
                </label>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Subtask
                </button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span
                      className={`text-xs font-medium ${
                        subtask.completed
                          ? "line-through text-slate-400"
                          : "text-slate-800"
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
              <label className="block text-xs font-semibold text-slate-700">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 appearance-none focus:outline-none focus:border-blue-500 pr-8"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 appearance-none focus:outline-none focus:border-blue-500 pr-8"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Assignee
              </label>
              <div className="relative">
                <div className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[9px] flex items-center justify-center">
                      AM
                    </div>
                    <span className="text-xs text-slate-800 font-medium">
                      {assignee}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Due Date
              </label>
              <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-white">
                <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Tags
              </label>
              <div className="border border-slate-200 rounded-lg p-2 bg-white space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-slate-600"
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
                  className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none pt-1"
                />
              </div>
            </div>

            {/* Blocks / Blocked By */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Blocks / Blocked By
              </label>
              <div className="border border-slate-200 rounded-lg p-2 bg-white space-y-2">
                <div className="inline-flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 text-slate-700 rounded p-1.5 text-xs w-full justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-500">
                      TASK-102
                    </span>
                    <span className="text-xs font-medium text-slate-800 truncate max-w-27.5">
                      Configure a...
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 pt-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Add Dependency</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
