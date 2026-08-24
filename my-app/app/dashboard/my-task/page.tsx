"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Search,
  Plus,
  AlertTriangle,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  ChevronUp,
  Minus,
} from "lucide-react";
import { myTasks as initialTasks, type MyTask } from "@/data/tasks";

export default function MyTaskPage() {
  const [tasks] = useState<MyTask[]>(initialTasks);

  const overdueTasks = tasks.filter((t) => t.section === "OVERDUE");
  const todayTasks = tasks.filter((t) => t.section === "TODAY");

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 font-sans text-foreground">
      <PathProvider />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks assigned to you across all projects.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-card border border-border rounded-xl p-3 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-50 flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter tasks..."
              className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          {["Status", "Priority", "Project", "Tag", "Due Date"].map(
            (filter) => (
              <button
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors font-medium"
              >
                {filter}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            ),
          )}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
          <span>Sort by:</span>
          <button className="inline-flex items-center gap-1.5 text-foreground font-medium hover:text-foreground">
            Due Date (Asc)
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-8">
        {/* OVERDUE Section */}
        {overdueTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold tracking-wider text-rose-500 uppercase">
                Overdue
              </span>
              <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {overdueTasks.length}
              </span>
            </div>
            <TaskTable tasks={overdueTasks} showHeader={true} />
          </div>
        )}

        {/* TODAY Section */}
        {todayTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                Today
              </span>
              <span className="bg-muted text-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                {todayTasks.length}
              </span>
            </div>
            <TaskTable tasks={todayTasks} showHeader={false} />
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* Component for Task Table */
}
function TaskTable({
  tasks,
  showHeader = false,
}: {
  tasks: MyTask[];
  showHeader?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse min-w-175">
        {showHeader && (
          <thead>
            <tr className="border-b border-border bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              <th className="p-3.5 pl-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-ring"
                />
              </th>
              <th className="p-3.5">Task</th>
              <th className="p-3.5">Project</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Due Date</th>
              <th className="p-3.5 pr-4">Tags</th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-muted/60 transition-colors"
            >
              <td className="p-3.5 pl-4 align-top">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-ring cursor-pointer mt-0.5"
                />
              </td>
              <td className="p-3.5 align-top max-w-xs">
                <p className="font-medium text-foreground leading-snug">
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{task.id}</p>
              </td>
              <td className="p-3.5 align-top text-muted-foreground font-normal">
                {task.project}
              </td>
              <td className="p-3.5 align-top">
                <StatusBadge status={task.status} />
              </td>
              <td className="p-3.5 align-top">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="p-3.5 align-top">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span
                    className={
                      task.section === "OVERDUE"
                        ? "text-rose-600 font-semibold"
                        : "text-foreground"
                    }
                  >
                    {task.dueDate}
                  </span>
                </div>
              </td>
              <td className="p-3.5 pr-4 align-top">
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block bg-muted text-muted-foreground text-[11px] font-medium px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
  /* Badge Helpers */
}
function StatusBadge({ status }: { status: string }) {
  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/100"></span>
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
      Todo
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
          <ChevronUp className="w-3.5 h-3.5" />
          Critical
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
          <ChevronUp className="w-3.5 h-3.5" />
          High
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Minus className="w-3.5 h-3.5" />
          Medium
        </span>
      );
  }
}
