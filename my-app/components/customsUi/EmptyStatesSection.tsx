"use client";

import React from "react";
import {
  FolderKanban,
  CheckSquare,
  SearchX,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

export default function EmptyStatesSection() {
  return (
    <section className="w-full max-w-6xl mx-auto p-6 sm:p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Empty States
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Reusable empty state patterns for different workspace contexts.
        </p>
      </div>

      {/* Grid Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: No Projects Yet */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-full flex flex-col items-center my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-600 mb-5">
              <FolderKanban className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-slate-900">
              No Projects Yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-55 mt-2">
              Create your first project to start organizing your team&apos;s
              work.
            </p>

            {/* Action Button */}
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-slate-400 mt-4">
            Context: Projects page
          </div>
        </div>

        {/* Card 2: No Tasks Yet */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-full flex flex-col items-center my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-600 mb-5">
              <CheckSquare className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-slate-900">No Tasks Yet</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-55 mt-2">
              Create a task to start tracking your work.
            </p>

            {/* Action Button */}
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-slate-400 mt-4">
            Context: Project Board / My Tasks
          </div>
        </div>

        {/* Card 3: No Search Results */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-95 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-full flex flex-col items-center my-auto">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-600 mb-5">
              <SearchX className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Title & Description */}
            <h2 className="text-base font-bold text-slate-900">
              No Search Results
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-55 mt-2">
              No tasks or projects match your search criteria.
            </p>

            {/* Outline Action Button */}
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Clear Filters
            </button>
          </div>

          {/* Context Footer Tag */}
          <div className="text-[11px] font-mono text-slate-400 mt-4">
            Context: Global Search / Filters
          </div>
        </div>
      </div>
    </section>
  );
}
