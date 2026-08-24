"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  MoreHorizontal,
  X,
  Calendar,
  AlertCircle,
  Folder,
  Plus,
  Link2,
  Send,
} from "lucide-react";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
}: TaskDetailModalProps) {
  const [comment, setComment] = useState("");

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
      {/* Backdrop / Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card Wrapper */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-800 z-10 my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">
              TASK-124
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              In Progress
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={onClose}
              className="hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Title & Description */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              Implement authentication flow
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Implement the complete authentication flow including login,
              registration and session handling.
            </p>
          </div>

          {/* Metadata Details Box */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs grid grid-cols-2 gap-y-5 gap-x-6">
            {/* Assignee */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                Assignee
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center justify-center">
                  AM
                </div>
                <span className="text-sm font-medium text-slate-800">
                  Alex Morgan
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                Due Date
              </span>
              <div className="flex items-center gap-2 text-slate-800">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Aug 28</span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                Priority
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                <AlertCircle className="w-3 h-3" />
                High
              </span>
            </div>

            {/* Project */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                Project
              </span>
              <div className="flex items-center gap-2 text-slate-800">
                <Folder className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Website Redesign</span>
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <span className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                Tags
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-xs font-mono font-medium px-2.5 py-1 rounded">
                  Frontend
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-mono font-medium px-2.5 py-1 rounded">
                  Authentication
                </span>
                <button className="border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 text-xs font-mono px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors">
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Dependency Section */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Dependency
            </h2>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono font-semibold text-slate-400">
                    TASK-102
                  </span>
                  <p className="text-sm font-medium text-slate-800">
                    Configure authentication
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase border border-blue-100">
                In Progress
              </span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="pt-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Activity
            </h2>

            <div className="relative pl-6 space-y-6">
              {/* Timeline Line */}
              <div className="absolute left-1.75 top-2 bottom-2 w-[1.5px] bg-slate-200" />

              {/* Item 1 */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-5.75 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  AM
                </div>
                <div>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      Alex Morgan
                    </span>{" "}
                    changed status to{" "}
                    <span className="font-medium text-blue-600">
                      In Progress
                    </span>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    2 hours ago
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-5.75 top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  JC
                </div>
                <div>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      John Carter
                    </span>{" "}
                    assigned task to{" "}
                    <span className="font-semibold text-slate-900">
                      Alex Morgan
                    </span>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Yesterday
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-5.75 top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  SC
                </div>
                <div>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      Sarah Chen
                    </span>{" "}
                    created the task
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Comment Input */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-xl px-3 py-2 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center justify-center shrink-0">
              AM
            </div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button className="text-blue-600 hover:text-blue-700 p-1 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
