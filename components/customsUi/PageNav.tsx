"use client";

import RouterNavigation from "./RouterNavigation";
import PathProvider from "./PathProvider";

/**
 * Uniform top navigation row for every dashboard page:
 * back/forward controls + breadcrumb trail.
 */
export default function PageNav() {
  return (
    <div className="flex items-center gap-3 min-w-0 mb-5">
      <RouterNavigation />
      <div className="h-5 w-px bg-border shrink-0" aria-hidden="true" />
      <PathProvider />
    </div>
  );
}