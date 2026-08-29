"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared dashboard page frame: consistent box modeling across every route.
 * Owns horizontal/vertical padding and the max-width gutter so each page
 * feels identical. The dashboard <main> only scrolls (no padding).
 */
export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-[calc(100vh-4rem)] bg-transparent font-sans text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}