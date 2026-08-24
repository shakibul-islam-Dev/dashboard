"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardErrorCardProps {
  onRetry?: () => void;
}

export default function DashboardErrorCard({
  onRetry,
}: DashboardErrorCardProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
    }
    // Reset loading state after a quick delay if no external promise passed
    setTimeout(() => {
      setIsRetrying(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
        {/* Warning Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
          <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Unable to Load Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mt-2">
          We couldn&apos;t load your dashboard data. Please check your
          connection or try again shortly.
        </p>

        {/* Retry Button */}
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
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
  );
}
