"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      {/* Main error card */}
      <Card className="p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
        <CardContent className="flex flex-col items-center justify-center text-center p-0">
          {/* Warning Icon Container */}
          <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
            <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Unable to Load Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mt-2">
            We couldn&apos;t load your dashboard data. Please check your
            connection or try again shortly.
          </p>

          {/* Retry Button */}
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-6"
            size="sm"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              "Try Again"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
