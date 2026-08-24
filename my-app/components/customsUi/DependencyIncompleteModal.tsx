"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { dependencyIncompleteInfo } from "@/data/tasks";

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
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border animate-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Warning Icon Badge */}
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Dependency Incomplete
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-muted-foreground transition-colors p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This task depends on another task that has not been completed yet.
          </p>

          {/* Prerequisite Task Box */}
          <div className="bg-muted border border-border rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Prerequisite Task
              </span>
              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/30/60">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
                {dependencyIncompleteInfo.prerequisiteTask.status}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {dependencyIncompleteInfo.prerequisiteTask.code}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {dependencyIncompleteInfo.prerequisiteTask.title}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            You are attempting to move the current task to{" "}
            <strong className="text-foreground font-semibold">
              {dependencyIncompleteInfo.targetStatus}
            </strong>
            , but its prerequisite is still being worked on.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 mt-6 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
