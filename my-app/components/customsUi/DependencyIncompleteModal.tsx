"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

interface DependencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function DependencyIncompleteModal({
  isOpen,
  onClose,
  onConfirm,
}: DependencyModalProps) {
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

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden font-sans text-slate-800 z-10 my-auto border border-slate-200/80 animate-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Warning Icon Badge */}
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Dependency Incomplete
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            This task depends on another task that has not been completed yet.
          </p>

          {/* Prerequisite Task Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Prerequisite Task
              </span>
              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                In Progress
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs font-mono font-medium text-slate-400">
                TASK-102
              </span>
              <span className="text-xs font-semibold text-slate-800">
                Configure authentication
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            You are attempting to move the current task to{" "}
            <strong className="text-slate-700 font-semibold">Done</strong>, but
            its prerequisite is still being worked on.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 mt-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Move Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
