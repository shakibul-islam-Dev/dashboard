"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Calendar, Plus } from "lucide-react";

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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden font-sans text-slate-800 z-10 my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set up a new workspace for your team.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-2 space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Q4 Enterprise Platform Redesign"
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the goals and scope of this project..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Status & Timeline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            {/* Status Field */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 appearance-none focus:outline-none focus:border-blue-500 pr-8"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Timeline Field */}
            <div className="sm:col-span-7 space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Timeline
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-300 focus:outline-none pr-4"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 absolute right-2.5" />
                </div>
                <span className="text-slate-300 font-light">—</span>
                <div className="relative flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-300 focus:outline-none pr-4"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 absolute right-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Team Members
            </label>
            <div className="flex items-center gap-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 font-bold text-[10px] items-center justify-center">
                  AM
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-300 text-slate-700 font-bold text-[10px] items-center justify-center">
                  JC
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-400 text-white font-bold text-[10px] items-center justify-center">
                  SC
                </div>
              </div>

              {/* Add People Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-600 transition-colors ml-1"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                Add People
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 mt-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
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
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
