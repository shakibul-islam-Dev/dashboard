"use client";

import React from "react";
import {
  FolderKanban,
  CheckSquare,
  SearchX,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyStatesSection() {
  return (
    <section className="w-full max-w-6xl mx-auto p-6 sm:p-10 font-sans text-foreground">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Empty States
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reusable empty state patterns for different workspace contexts.
        </p>
      </div>

      {/* Grid Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: No Projects Yet */}
        <Card className="p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center text-center p-0 w-full my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-5">
              <FolderKanban className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-foreground">
              No Projects Yet
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-55 mt-2">
              Create your first project to start organizing your team&apos;s
              work.
            </p>

            {/* Create Project Button */}
            <Button className="mt-6" size="sm">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </CardContent>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-muted-foreground mt-4">
            Context: Projects page
          </div>
        </Card>

        {/* Card 2: No Tasks Yet */}
        <Card className="p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center text-center p-0 w-full my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-5">
              <CheckSquare className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-foreground">No Tasks Yet</h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-55 mt-2">
              Create a task to start tracking your work.
            </p>

            {/* Create Task Button */}
            <Button className="mt-6" size="sm">
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </CardContent>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-muted-foreground mt-4">
            Context: Project Board / My Tasks
          </div>
        </Card>

        {/* Card 3: No Search Results */}
        <Card className="p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center text-center p-0 w-full my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-5">
              <SearchX className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-foreground">
              No Search Results
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-55 mt-2">
              No tasks or projects match your search criteria.
            </p>

            {/* Clear Filters Button */}
            <Button variant="outline" className="mt-6" size="sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              Clear Filters
            </Button>
          </CardContent>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-muted-foreground mt-4">
            Context: Global Search / Filters
          </div>
        </Card>
      </div>
    </section>
  );
}
