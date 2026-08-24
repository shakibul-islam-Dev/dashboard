"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, RefreshCw } from "lucide-react";

interface GlobalErrorCardProps {
  onRetry?: () => void;
  dashboardHref?: string;
}

export default function GlobalErrorCard({
  onRetry,
  dashboardHref = "/dashboard",
}: GlobalErrorCardProps) {
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
      <div className="w-full bg-card border border-border rounded-2xl p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
        {/* Soft Circular Radial Glow Behind Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-muted blur-xl scale-150" />
          <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-foreground bg-muted/50">
            <Wrench className="w-7 h-7 stroke-[1.75]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Something Went Wrong
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mt-2">
          An unexpected error occurred while processing your request.
          <br />
          Please try again or return to the dashboard.
        </p>

        {/* Dual Action Buttons */}
        <div className="mt-8 flex items-center gap-3">
          {/* Back to Dashboard Button */}
          <Link
            href={dashboardHref}
            className="px-4 py-2.5 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
          >
            Back to Dashboard
          </Link>

          {/* Try Again Primary Button */}
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-hover disabled:opacity-75 text-primary-foreground rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
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
