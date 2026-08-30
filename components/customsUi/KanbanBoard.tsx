"use client";

import React, { useMemo, useState } from "react";
import {
  Ban,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ListTodo,
  RotateCcw,
  Search,
} from "lucide-react";

/* Board logic */
import {
  KANBAN_STATUSES,
  filterKanbanTasks,
  toKanbanColumn,
  type KanbanStatus,
} from "@/lib/kanbanFilters";
import { findDependencyTask } from "@/lib/dependency";
import { parseDueDate } from "@/lib/taskFilters";

/* shadcn UI components */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Task shape rendered by the board ── */
export interface KanbanTask {
  id: string;
  title: string;
  status: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  /** Free-form reference (task id or title) to a task this one depends on. */
  dependency?: string | null;
}

interface KanbanBoardProps {
  tasks: KanbanTask[];
  /** Called after a drag-drop or keyboard move; the parent owns any gating. */
  onStatusChange: (taskId: string, status: KanbanStatus) => void;
  /** Opens the task detail view (click on the card title). */
  onOpenTask?: (task: KanbanTask) => void;
}

/* ── Column / priority styling ── */
const COLUMN_META: Record<
  KanbanStatus,
  { accent: string; badge: string; dot: string }
> = {
  Todo: {
    accent: "border-t-slate-400",
    badge: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  },
  "In Progress": {
    accent: "border-t-blue-500",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Review: {
    accent: "border-t-amber-500",
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  Done: {
    accent: "border-t-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const PRIORITY_STYLES: Record<string, string> = {
  Critical: "bg-rose-50 text-rose-600 border-rose-200/80",
  High: "bg-amber-50 text-amber-600 border-amber-200/80",
  Medium: "bg-blue-50 text-blue-600 border-blue-200/80",
  Low: "bg-muted text-muted-foreground",
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN BOARD COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
export default function KanbanBoard({
  tasks,
  onStatusChange,
  onOpenTask,
}: KanbanBoardProps) {
  /* ── Filters (search, priority, assignee, tag) ── */
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  /* Reference timestamp for "overdue" determination (start of today; immutable
     per mount) so a task due today is not treated as overdue. */
  const [now] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const assigneeOptions = useMemo(
    () =>
      Array.from(
        new Set(tasks.map((t) => t.assignee).filter((a): a is string => !!a)),
      ).sort(),
    [tasks],
  );

  const tagOptions = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags ?? []))).sort(),
    [tasks],
  );

  const filtered = useMemo(
    () =>
      filterKanbanTasks(tasks, {
        search,
        priority: priorityFilter,
        assignee: assigneeFilter,
        tag: tagFilter,
      }),
    [tasks, search, priorityFilter, assigneeFilter, tagFilter],
  );

  const filtersActive =
    search.trim() !== "" ||
    priorityFilter !== "All" ||
    assigneeFilter !== "All" ||
    tagFilter !== "All";

  const resetFilters = () => {
    setSearch("");
    setPriorityFilter("All");
    setAssigneeFilter("All");
    setTagFilter("All");
  };

  /* ── Drag & drop state ── */
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<KanbanStatus | null>(null);

  const handleDrop = (status: KanbanStatus) => {
    const id = draggingId;
    setDraggingId(null);
    setDropTarget(null);
    if (!id) return;
    const task = tasks.find((t) => t.id === id);
    if (!task || toKanbanColumn(task.status) === status) return;
    onStatusChange(id, status);
  };

  /* ── Board-level empty states ── */
  if (tasks.length === 0) {
    return (
      <Card className="border-dashed border-border shadow-none">
        <CardContent className="py-16 text-center text-muted-foreground">
          <ListTodo className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">No tasks in this project yet.</p>
          <p className="text-xs mt-1">
            Click &quot;Add Task&quot; to create the first one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Filter Toolbar ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2">
        <div className="relative min-w-44 flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search board tasks"
          />
        </div>

        <Select
          value={priorityFilter}
          onValueChange={(v) => v && setPriorityFilter(v)}
        >
          <SelectTrigger className="text-xs" aria-label="Filter by priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Low", "Medium", "High", "Critical"].map((p) => (
              <SelectItem key={p} value={p}>
                {p === "All" ? "Priority: All" : p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={assigneeFilter}
          onValueChange={(v) => v && setAssigneeFilter(v)}
        >
          <SelectTrigger className="text-xs" aria-label="Filter by assignee">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Unassigned", ...assigneeOptions].map((a) => (
              <SelectItem key={a} value={a}>
                {a === "All" ? "Assignee: All" : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {tagOptions.length > 0 && (
          <Select value={tagFilter} onValueChange={(v) => v && setTagFilter(v)}>
            <SelectTrigger className="text-xs" aria-label="Filter by tag">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", ...tagOptions].map((t) => (
                <SelectItem key={t} value={t}>
                  {t === "All" ? "Tag: All" : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filtersActive && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
            onClick={resetFilters}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Filtered-empty state ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Card className="border-dashed border-border shadow-none">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-sm font-medium">No tasks match your filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 mt-3"
              onClick={resetFilters}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* ── Columns Grid ────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {KANBAN_STATUSES.map((status) => {
            const columnTasks = filtered.filter(
              (t) => toKanbanColumn(t.status) === status,
            );
            const meta = COLUMN_META[status];
            const isDropTarget = dropTarget === status;

            return (
              <section
                key={status}
                aria-label={`${status} column, ${columnTasks.length} tasks`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDropTarget(status);
                }}
                onDragLeave={() =>
                  setDropTarget((s) => (s === status ? null : s))
                }
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(status);
                }}
                className={`bg-muted/70 border border-border border-t-4 ${meta.accent} rounded-2xl p-3 flex flex-col gap-3 min-h-100 transition-shadow ${
                  isDropTarget
                    ? "ring-2 ring-primary/60 shadow-lg"
                    : "shadow-none"
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${meta.dot}`}
                      aria-hidden
                    />
                    <h3 className="text-sm font-bold text-foreground">
                      {status}
                    </h3>
                    <Badge
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${meta.badge}`}
                    >
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  {columnTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border/70 rounded-xl">
                      Drop tasks here
                    </p>
                  )}
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      tasks={tasks}
                      now={now}
                      isDragging={draggingId === task.id}
                      onDragStart={(id) => setDraggingId(id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDropTarget(null);
                      }}
                      onMove={(next) => onStatusChange(task.id, next)}
                      onOpen={() => onOpenTask?.(task)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TASK CARD COMPONENT — draggable, keyboard-movable, dependency-aware
   ══════════════════════════════════════════════════════════════════════════════ */
function TaskCard({
  task,
  tasks,
  now,
  isDragging,
  onDragStart,
  onDragEnd,
  onMove,
  onOpen,
}: {
  task: KanbanTask;
  tasks: KanbanTask[];
  now: number;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onMove: (status: KanbanStatus) => void;
  onOpen: () => void;
}) {
  const status = toKanbanColumn(task.status);
  const columnIndex = KANBAN_STATUSES.indexOf(status);
  const prevStatus = columnIndex > 0 ? KANBAN_STATUSES[columnIndex - 1] : null;
  const nextStatus =
    columnIndex < KANBAN_STATUSES.length - 1
      ? KANBAN_STATUSES[columnIndex + 1]
      : null;

  /* Live dependency lookup against the project's stored task data. */
  const dependency = findDependencyTask(task.dependency, tasks, task.id);
  const blockedByDependency = !!task.dependency && dependency?.status !== "Done";

  const dueMs = task.dueDate ? parseDueDate(task.dueDate) : null;
  const isOverdue =
    dueMs !== null &&
    dueMs !== Number.MAX_SAFE_INTEGER &&
    dueMs < now &&
    status !== "Done";

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      className={`group bg-card border border-border rounded-xl shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40 scale-0.98" : "opacity-100"
      }`}
      aria-label={`Task ${task.id}: ${task.title}. Status ${status}.${
        task.priority ? ` Priority ${task.priority}.` : ""
      }`}
    >
      <div className="p-3 space-y-2.5">
        {/* Header: id + drag hint + priority */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground font-medium min-w-0">
            <GripVertical className="w-3 h-3 opacity-40 shrink-0" />
            {task.id}
          </span>
          {task.priority && (
            <Badge
              variant="outline"
              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] shrink-0 ${
                PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low
              }`}
            >
              {task.priority}
            </Badge>
          )}
        </div>

        {/* Title (opens details) */}
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="text-left w-full text-xs font-bold text-foreground leading-snug hover:text-primary transition-colors cursor-pointer"
          >
            {task.title}
          </button>
        ) : (
          <h4 className="text-xs font-bold text-foreground leading-snug">
            {task.title}
          </h4>
        )}

        {/* Blocked-by warning (live from stored task data) */}
        {blockedByDependency && (
          <div
            className="flex items-center gap-1.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 rounded-md px-1.5 py-1"
            title={
              dependency
                ? `Blocked by ${dependency.id} — currently ${dependency.status}`
                : `Blocked by "${task.dependency}" which could not be found`
            }
          >
            <Ban className="w-3 h-3 shrink-0" />
            <span className="truncate">
              Blocked by {dependency ? dependency.id : task.dependency}
            </span>
          </div>
        )}

        {/* Tags */}
        {(task.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(task.tags ?? []).slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-medium"
              >
                {tag}
              </Badge>
            ))}
            {(task.tags ?? []).length > 3 && (
              <span className="text-[9px] text-muted-foreground self-center">
                +{task.tags!.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: due date + assignee + keyboard moves */}
        <div className="pt-1.5 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                  isOverdue ? "text-rose-600 font-semibold" : "text-muted-foreground"
                }`}
              >
                <Calendar className="w-3 h-3 shrink-0" />
                {task.dueDate}
              </span>
            )}
            {task.assignee && (
              <Avatar className="w-5 h-5 border border-border" title={task.assignee}>
                <AvatarFallback className="bg-primary/15 text-[8px] font-bold text-primary">
                  {initialsOf(task.assignee)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Keyboard-friendly column moves (visible on hover/focus) */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {prevStatus && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Move ${task.title} to ${prevStatus}`}
                title={`Move to ${prevStatus}`}
                onClick={() => onMove(prevStatus)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            )}
            {nextStatus && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Move ${task.title} to ${nextStatus}`}
                title={`Move to ${nextStatus}`}
                onClick={() => onMove(nextStatus)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
