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

// Mock Data matching the UI
const initialTasks = [
  {
    id: "TASK-95",
    title: "Finalize homepage mockups",
    project: "Website Redesign",
    status: "In Progress",
    priority: "Critical",
    dueDate: "Oct 28",
    tags: ["Design"],
    section: "OVERDUE",
  },
  {
    id: "TASK-102",
    title: "Configure authentication",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
    tags: ["Backend", "Security"],
    section: "TODAY",
  },
  {
    id: "TASK-115",
    title: "Implement task filtering",
    project: "Dashboard Redesign",
    status: "Todo",
    priority: "Medium",
    dueDate: "Today",
    tags: ["Frontend"],
    section: "TODAY",
  },
];

export default function MyTaskPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const overdueTasks = tasks.filter((t) => t.section === "OVERDUE");
  const todayTasks = tasks.filter((t) => t.section === "TODAY");

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-800">
      <PathProvider />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tasks assigned to you across all projects.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-50 flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter tasks..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          {["Status", "Priority", "Project", "Tag", "Due Date"].map(
            (filter) => (
              <button
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
              >
                {filter}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ),
          )}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 text-sm text-slate-500 pl-2">
          <span>Sort by:</span>
          <button className="inline-flex items-center gap-1.5 text-slate-800 font-medium hover:text-slate-900">
            Due Date (Asc)
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
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
              <span className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                Today
              </span>
              <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
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
  tasks: any[];
  showHeader?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse min-w-175">
        {showHeader && (
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="p-3.5 pl-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="p-3.5 pl-4 align-top">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                />
              </td>
              <td className="p-3.5 align-top max-w-xs">
                <p className="font-medium text-slate-900 leading-snug">
                  {task.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{task.id}</p>
              </td>
              <td className="p-3.5 align-top text-slate-600 font-normal">
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
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span
                    className={
                      task.section === "OVERDUE"
                        ? "text-rose-600 font-semibold"
                        : "text-slate-700"
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
                      className="inline-block bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded"
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
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
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          <Minus className="w-3.5 h-3.5" />
          Medium
        </span>
      );
  }
}
