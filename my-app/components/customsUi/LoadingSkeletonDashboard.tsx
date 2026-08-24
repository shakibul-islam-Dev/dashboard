"use client";

import React from "react";

export default function LoadingSkeletonDashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Top Section: Split 2-Column Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Left Skeleton Card (Board / Metrics View) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-pulse space-y-6">
          {/* Header Skeleton Bar */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-36 bg-slate-200/80 rounded-lg" />
            <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            <div className="h-6 w-16 bg-slate-100 rounded-lg" />
          </div>

          {/* 4 Cards Row Skeleton */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2"
              >
                <div className="h-3 w-3/4 bg-slate-200/80 rounded" />
                <div className="h-2.5 w-1/2 bg-slate-200/60 rounded" />
                <div className="h-2 w-full bg-slate-100 rounded mt-3" />
                <div className="h-2 w-2/3 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          {/* Bottom Large Graphic / Chart Skeleton Blocks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-36 bg-slate-100/80 rounded-xl border border-slate-100" />
            <div className="h-36 bg-slate-100/80 rounded-xl border border-slate-100" />
          </div>
        </div>

        {/* Top Right Skeleton Card (Task Detail View Overlay) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-center animate-pulse">
          <div className="w-full max-w-md border border-slate-100 rounded-2xl p-6 space-y-5 bg-white shadow-2xs">
            {/* Header Icon + Circle */}
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200/80" />
              <div className="w-5 h-5 rounded-full bg-slate-200/60" />
            </div>

            {/* Title & Body Paragraph Skeletons */}
            <div className="space-y-2">
              <div className="h-4 w-4/5 bg-slate-200/90 rounded-md" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>

            {/* Divider Line & Metadata Rows */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-slate-200/70 rounded" />
                <div className="h-3 w-12 bg-slate-100 rounded" />
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full" />
            </div>

            {/* Avatars Stack & Footer Button Skeletons */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-200/80 ring-2 ring-white" />
                <div className="w-6 h-6 rounded-full bg-slate-200/80 ring-2 ring-white" />
                <div className="w-6 h-6 rounded-full bg-slate-200/80 ring-2 ring-white" />
              </div>
              <div className="h-7 w-20 bg-slate-200/80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Table View Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-pulse space-y-5">
        {/* Table Title Skeleton */}
        <div className="h-5 w-28 bg-slate-200/80 rounded-md" />

        {/* Table View Component */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-150 space-y-3">
            {/* Table Header Row Skeleton */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-100">
              <div className="col-span-1 h-3 bg-slate-200/80 rounded" />
              <div className="col-span-6 h-3 bg-slate-200/80 rounded" />
              <div className="col-span-1.5 h-3 bg-slate-200/80 rounded" />
              <div className="col-span-1.5 h-3 bg-slate-200/80 rounded" />
              <div className="col-span-2 h-3 bg-slate-200/80 rounded" />
            </div>

            {/* Table Body Rows Skeletons */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-12 gap-4 items-center py-2"
              >
                <div className="col-span-1 h-3 w-8 bg-slate-100 rounded" />
                <div className="col-span-6 h-3 w-full bg-slate-100/90 rounded" />
                <div className="col-span-1.5 h-5 bg-slate-100 rounded-full" />
                <div className="col-span-1.5 h-5 bg-slate-100 rounded-full" />
                <div className="col-span-2 h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
