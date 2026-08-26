"use client";

import React from "react";

export default function LoadingSkeletonDashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-muted/50 min-h-screen">
      {/* Top Section: Split 2-Column Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Left Skeleton Card (Board / Metrics View) */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-xs animate-pulse space-y-6">
          {/* Header Skeleton Bar */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-36 bg-muted rounded-lg" />
            <div className="h-6 w-16 bg-muted rounded-lg" />
            <div className="h-6 w-16 bg-muted rounded-lg" />
          </div>

          {/* 4 Cards Row Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-muted border border-border rounded-xl p-3 space-y-2"
              >
                <div className="h-3 w-3/4 bg-muted rounded" />
                <div className="h-2.5 w-1/2 bg-muted/60 rounded" />
                <div className="h-2 w-full bg-muted rounded mt-3" />
                <div className="h-2 w-2/3 bg-muted rounded" />
              </div>
            ))}
          </div>

          {/* Bottom Large Graphic / Chart Skeleton Blocks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 sm:h-36 bg-muted rounded-xl border border-border" />
            <div className="h-24 sm:h-36 bg-muted rounded-xl border border-border" />
          </div>
        </div>

        {/* Top Right Skeleton Card (Task Detail View Overlay) */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-xs flex items-center justify-center animate-pulse">
          <div className="w-full max-w-md border border-border rounded-2xl p-6 space-y-5 bg-card shadow-2xs">
            {/* Header Icon + Circle */}
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-muted" />
              <div className="w-5 h-5 rounded-full bg-muted/60" />
            </div>

            {/* Title & Body Paragraph Skeletons */}
            <div className="space-y-2">
              <div className="h-4 w-4/5 bg-muted rounded-md" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>

            {/* Divider Line & Metadata Rows */}
            <div className="pt-2 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-muted/70 rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </div>

            {/* Avatars Stack & Footer Button Skeletons */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted ring-2 ring-white" />
                <div className="w-6 h-6 rounded-full bg-muted ring-2 ring-white" />
                <div className="w-6 h-6 rounded-full bg-muted ring-2 ring-white" />
              </div>
              <div className="h-7 w-20 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Table View Skeleton */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs animate-pulse space-y-5">
        {/* Table Title Skeleton */}
        <div className="h-5 w-28 bg-muted rounded-md" />

        {/* Table View Component */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-150 space-y-3">
            {/* Table Header Row Skeleton */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border">
              <div className="col-span-1 h-3 bg-muted rounded" />
              <div className="col-span-6 h-3 bg-muted rounded" />
              <div className="col-span-1.5 h-3 bg-muted rounded" />
              <div className="col-span-1.5 h-3 bg-muted rounded" />
              <div className="col-span-2 h-3 bg-muted rounded" />
            </div>

            {/* Table Body Rows Skeletons */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-12 gap-4 items-center py-2"
              >
                <div className="col-span-1 h-3 w-8 bg-muted rounded" />
                <div className="col-span-6 h-3 w-full bg-muted rounded" />
                <div className="col-span-1.5 h-5 bg-muted rounded-full" />
                <div className="col-span-1.5 h-5 bg-muted rounded-full" />
                <div className="col-span-2 h-3 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
