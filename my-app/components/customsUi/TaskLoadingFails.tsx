"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface TaskLoadingFailsProps {
  onRetry?: () => void;
}

export default function TaskLoadingFails({ onRetry }: TaskLoadingFailsProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Skeleton Sidebar Card */}
        <div className="md:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-center space-y-4 animate-pulse">
          {/* Top Short Skeleton Bar */}
          <div className="h-4 w-1/3 bg-muted rounded-md" />

          {/* Block Skeleton 1 */}
          <div className="h-10 w-full bg-muted rounded-lg" />

          {/* Block Skeleton 2 */}
          <div className="h-10 w-full bg-muted rounded-lg" />
        </div>

        {/* Right Error State Box with Dashed Border */}
        <div className="md:col-span-7 bg-card/60 border-2 border-dashed border-border rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center">
          {/* Circle Alert Icon */}
          <div className="text-muted-foreground mb-3">
            <AlertCircle className="w-6 h-6 stroke-[1.75]" />
          </div>

          {/* Title & Description */}
          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
            Unable to Load Tasks
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Something went wrong while loading your tasks.
          </p>

          {/* Outline Action Button */}
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 bg-card hover:bg-muted border border-primary text-primary disabled:opacity-75 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Retrying...
              </>
            ) : (
              "Try Again"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
