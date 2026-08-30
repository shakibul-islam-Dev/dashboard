"use client";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import CreateProjectModal from "@/components/customsUi/CreateProjectModal";
import CreateTaskModal from "@/components/customsUi/CreateTaskModal";
import EditTaskModal from "@/components/customsUi/EditTaskModal";
import KanbanBoard from "@/components/customsUi/KanbanBoard";
import TaskDetailModal from "@/components/customsUi/TaskDetailModal";
import DependencyIncompleteModal from "@/components/customsUi/DependencyIncompleteModal";
import { KANBAN_STATUSES, toKanbanColumn, type KanbanStatus } from "@/lib/kanbanFilters";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  FolderKanban,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  Calendar,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  GripVertical,
  Columns3,
  Layers,
} from "lucide-react";
import { projectBoardData, projectsPageData, type BoardProject } from "@/data/projects";
import { sortBoardProjects } from "@/lib/projectFilters";
import { useCustomProjects, useIdSet, LS_DELETED_TASKS_KEY } from "@/lib/customStore";
import { useProjectTasks, type ProjectTask } from "@/lib/useProjectTasks";
import { evaluateDependencyGate, type DependencyRef } from "@/lib/dependency";

// shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Column sort / collapse definitions ────────────────────────────────────────
type ColumnKey = "overdue" | "running" | "upcoming" | "newProjects";

const SORT_OPTIONS = [
  { label: "Sort by Priority", value: "priority" },
  { label: "Sort by Due Date", value: "dueDate" },
  { label: "Collapse Column", value: "collapse" },
] as const;

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function ProjectBoard() {
  // ── View mode: task Kanban board (default) or project portfolio ───────────
  const [view, setView] = useState<"board" | "portfolio">("board");

  // ── Project selector for the board view ───────────────────────────────────
  const { projects: customProjects } = useCustomProjects();
  const deletedTasks = useIdSet(LS_DELETED_TASKS_KEY);

  // ── Portfolio columns: static demo data + user-created projects merged in
  //    so a newly created project shows up in the board. ─────────────────────
  const projects = useMemo(() => {
    const custom: BoardProject[] = (customProjects ?? []).map((p) => ({
      id: p.id,
      key: p.id,
      title: p.name,
      description: p.description || "No description provided.",
      dueDate: p.endDate || "TBD",
      progress: 0,
      priority: "Normal",
      projectManager: { name: "You", avatar: "YOU" },
      teamLead: { name: "You", avatar: "YOU" },
      developers: (p.teamMembers ?? []).map((m, i) => ({
        name: `Member ${i + 1}`,
        avatar: m.initials,
      })),
    }));
    return {
      overdue: projectBoardData.overdue,
      running: projectBoardData.running,
      upcoming: projectBoardData.upcoming,
      newProjects: [...projectBoardData.newProjects, ...custom],
    };
  }, [customProjects]);

  const projectOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: { id: string; title: string }[] = [];
    const push = (id: string, title: string) => {
      if (!seen.has(id)) {
        seen.add(id);
        options.push({ id, title });
      }
    };
    projectsPageData.forEach((p) => push(p.id, p.title));
    (Object.values(projectBoardData) as BoardProject[][]).flat().forEach((p) =>
      push(p.id, p.title),
    );
    customProjects.forEach((p) => push(p.id, p.name));
    return options;
  }, [customProjects]);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectOptions[0]?.id ?? null,
  );
  const selectedProject = useMemo(
    () =>
      projectOptions.find((p) => p.id === selectedProjectId) ?? null,
    [projectOptions, selectedProjectId],
  );

  const { tasks, setTaskStatus } = useProjectTasks(
    selectedProject?.id,
    selectedProject?.title,
  );
  const boardTasks = useMemo<ProjectTask[]>(
    () => tasks.filter((t) => !deletedTasks.has(t.id)),
    [tasks, deletedTasks],
  );

  // ── Dependency gate when moving a task to Done ────────────────────────────
  const [pendingMove, setPendingMove] = useState<{
    id: string;
    status: string;
    prerequisite: DependencyRef;
  } | null>(null);
  const [detailTask, setDetailTask] = useState<ProjectTask | null>(null);

  // ── Edit Task modal target (opened from the Task Detail pencil icon) ──────
  const [editTarget, setEditTarget] = useState<{
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee?: string;
    dueDate: string;
    tags: string[];
    dependency?: string | null;
  } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditTask = (task?: {
    id?: string;
    title?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    dueDate?: string;
    tags?: string[];
    dependency?: string | null;
  } | null) => {
    if (!task?.id) return;
    setEditTarget({
      id: task.id,
      title: task.title ?? "Untitled task",
      status: task.status ?? "Todo",
      priority: task.priority ?? "Medium",
      assignee: task.assignee,
      dueDate: task.dueDate ?? "",
      tags: task.tags ?? [],
      dependency: task.dependency ?? null,
    });
    setShowEditModal(true);
  };

  const requestStatusChange = (id: string, status: KanbanStatus) => {
    const task = boardTasks.find((t) => t.id === id);
    if (!task) return;

    const gate = evaluateDependencyGate({
      dependency: task.dependency,
      tasks: boardTasks,
      nextStatus: status,
      selfId: task.id,
    });
    if (gate) {
      setPendingMove({ id, status, prerequisite: gate.prerequisite });
      return;
    }

    setTaskStatus(id, status);
    toast.success("Status updated", {
      description: `"${task.title}" moved to ${status}.`,
    });
  };

  const confirmPendingMove = () => {
    if (!pendingMove) return;
    const task = boardTasks.find((t) => t.id === pendingMove.id);
    setTaskStatus(pendingMove.id, pendingMove.status);
    setPendingMove(null);
    toast.success("Status updated", {
      description: `"${task?.title ?? "Task"}" moved to ${pendingMove.status}.`,
    });
  };

  // ── Create Project modal state ─────────────────────────────────────────────
  const [showCreateProject, setShowCreateProject] = React.useState(false);

  // ── Create Task modal state (board view) ──────────────────────────────────
  const [showCreateTask, setShowCreateTask] = React.useState(false);

  // ── Feature 4: Active column dropdown menu ─────────────────────────────────
  const [activeMenuColumn, setActiveMenuColumn] = React.useState<string | null>(
    null
  );

  // ── Feature 6: Collapsed columns state ─────────────────────────────────────
  const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(
    new Set()
  );

  // ── Sort state per column ──────────────────────────────────────────────────
  const [columnSorts, setColumnSorts] = React.useState<
    Record<ColumnKey, "priority" | "dueDate" | null>
  >({
    overdue: null,
    running: null,
    upcoming: null,
    newProjects: null,
  });

  // ── Close column menu when clicking outside ────────────────────────────────
  const menuRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuColumn(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Toggle collapse for a column ───────────────────────────────────────────
  function toggleCollapse(columnKey: string) {
    setCollapsedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      return next;
    });
  }

  // ── Handle column menu action ──────────────────────────────────────────────
  function handleColumnMenuAction(columnKey: ColumnKey, action: string) {
    if (action === "collapse") {
      toggleCollapse(columnKey);
    } else if (action === "priority" || action === "dueDate") {
      setColumnSorts((prev) => ({
        ...prev,
        [columnKey]: prev[columnKey] === action ? null : action,
      }));
    }
    setActiveMenuColumn(null);
  }

  // ── Is column collapsed helper ─────────────────────────────────────────────
  function isCollapsed(key: string) {
    return collapsedColumns.has(key);
  }

  // ── Column definitions for clean rendering ─────────────────────────────────
  const columns: {
    key: ColumnKey;
    title: string;
    badgeBg: string;
    accentBorder: string;
    data: BoardProject[];
    isOverdue?: boolean;
  }[] = [
    {
      key: "overdue",
      title: "Overdue",
      badgeBg: "bg-rose-100 text-rose-700",
      accentBorder: "border-t-rose-500",
      data: projects.overdue,
      isOverdue: true,
    },
    {
      key: "running",
      title: "Running",
      badgeBg: "bg-amber-100 text-amber-700",
      accentBorder: "border-t-amber-500",
      data: projects.running,
    },
    {
      key: "upcoming",
      title: "Upcoming",
      badgeBg: "bg-primary/15 text-primary",
      accentBorder: "border-t-primary",
      data: projects.upcoming,
    },
    {
      key: "newProjects",
      title: "New Projects",
      badgeBg: "bg-emerald-100 text-emerald-700",
      accentBorder: "border-t-emerald-500",
      data: projects.newProjects,
    },
  ];

  return (
    <PageContainer>
      {/* ── Header Section ──────────────────────────────────────────────────── */}
      <PageNav />
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Workspace Project Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor active sprints, overdue milestones, and team assignments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle: Task board ↔ Project portfolio */}
          <div
            className="flex items-center rounded-lg border border-border p-0.5"
            role="group"
            aria-label="Project board view mode"
          >
            <Button
              variant={view === "board" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5 cursor-pointer"
              aria-pressed={view === "board"}
              onClick={() => setView("board")}
            >
              <Layers className="w-3.5 h-3.5" />
              Task Board
            </Button>
            <Button
              variant={view === "portfolio" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5 cursor-pointer"
              aria-pressed={view === "portfolio"}
              onClick={() => setView("portfolio")}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Portfolio
            </Button>
          </div>

          {/* ── Feature 1: Create New Project Button ────────────────────────── */}
          <Button
            className="gap-2 self-start md:self-auto cursor-pointer"
            onClick={() => setShowCreateProject(true)}
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* ── Feature 1: Render CreateProjectModal ────────────────────────────── */}
      {showCreateProject && (
        <CreateProjectModal
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
        />
      )}

      {/* ── Render CreateTaskModal (pre-filled with the selected project) ───── */}
      {showCreateTask && (
        <CreateTaskModal
          key={`${selectedProject?.id ?? "none"}-create-task`}
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          defaultProject={selectedProject?.title}
        />
      )}

      {view === "board" ? (
        /* ════════════════════════════════════════════════════════════════════
           TASK KANBAN BOARD — Todo / In Progress / Review / Done columns
           ════════════════════════════════════════════════════════════════════ */
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Project selector + count */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Columns3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Project
              </span>
              <Select
                value={selectedProjectId ?? undefined}
                onValueChange={(v) => v && setSelectedProjectId(v)}
              >
                <SelectTrigger className="w-64 text-sm" aria-label="Select project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {boardTasks.length} task{boardTasks.length !== 1 ? "s" : ""}
              </span>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setShowCreateTask(true)}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Status count strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KANBAN_STATUSES.map((status, idx) => {
              const count = boardTasks.filter(
                (t) => toKanbanColumn(t.status) === status,
              ).length;
              const dot = ["bg-slate-400", "bg-blue-500", "bg-amber-500", "bg-emerald-500"][idx];
              return (
                <Card key={status} className="rounded-2xl shadow-2xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${dot}`} />
                    <p className="text-xs font-medium text-muted-foreground flex-1">
                      {status}
                    </p>
                    <p className="text-xl font-bold text-foreground">{count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* The board */}
          <KanbanBoard
            tasks={boardTasks}
            onStatusChange={requestStatusChange}
            onOpenTask={(task) =>
              setDetailTask(boardTasks.find((t) => t.id === task.id) ?? null)
            }
          />

          {/* Task detail + dependency warning modals */}
          <TaskDetailModal
            isOpen={!!detailTask}
            onClose={() => setDetailTask(null)}
            onEdit={handleEditTask}
            task={
              detailTask
                ? { ...detailTask, project: selectedProject?.title }
                : undefined
            }
            dependencyTasks={boardTasks}
          />

          {/* Edit Task Modal (opened via the detail pencil icon) */}
          <EditTaskModal
            key={editTarget?.id ?? "edit"}
            isOpen={showEditModal && !!editTarget}
            onClose={() => setShowEditModal(false)}
            task={
              editTarget
                ? {
                    id: editTarget.id,
                    title: editTarget.title,
                    status: editTarget.status,
                    priority: editTarget.priority,
                    assignee: editTarget.assignee,
                    dueDate: editTarget.dueDate ?? "",
                    tags: editTarget.tags,
                    dependency: editTarget.dependency ?? null,
                  }
                : null
            }
            dependencyTasks={boardTasks}
          />
          <DependencyIncompleteModal
            isOpen={!!pendingMove}
            onClose={() => setPendingMove(null)}
            onConfirm={confirmPendingMove}
            prerequisite={pendingMove?.prerequisite ?? null}
            targetStatus={pendingMove?.status ?? "Done"}
          />
        </div>
      ) : (
      <>

      {/* ── Metrics Summary Strip ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric: Running */}
        <Card className="rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Running
              </p>
              <p className="text-xl font-bold text-foreground">
                {projects.running.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric: Upcoming */}
        <Card className="rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Upcoming
              </p>
              <p className="text-xl font-bold text-foreground">
                {projects.upcoming.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric: New Projects */}
        <Card className="rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                New Projects
              </p>
              <p className="text-xl font-bold text-foreground">
                {projects.newProjects.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric: Overdue */}
        <Card className="rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Overdue
              </p>
              <p className="text-xl font-bold text-foreground">
                {projects.overdue.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Board Columns Grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col) => (
          <BoardColumn
            key={col.key}
            title={col.title}
            count={col.data.length}
            badgeBg={col.badgeBg}
            accentBorder={col.accentBorder}
            columnKey={col.key}
            collapsed={isCollapsed(col.key)}
            activeMenuColumn={activeMenuColumn}
            menuRef={menuRef}
            onToggleMenu={() =>
              setActiveMenuColumn(
                activeMenuColumn === col.key ? null : col.key
              )
            }
            onMenuAction={(action) => handleColumnMenuAction(col.key, action)}
            onExpand={() => toggleCollapse(col.key)}
          >
            {sortBoardProjects(col.data, columnSorts[col.key]).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isOverdue={col.isOverdue}
              />
            ))}
          </BoardColumn>
        ))}
      </div>
      </>
      )}
    </PageContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BOARD COLUMN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function BoardColumn({
  title,
  count,
  badgeBg,
  accentBorder,
  columnKey,
  collapsed,
  activeMenuColumn,
  menuRef,
  onToggleMenu,
  onMenuAction,
  onExpand,
  children,
}: {
  title: string;
  count: number;
  badgeBg: string;
  accentBorder: string;
  columnKey: string;
  collapsed: boolean;
  activeMenuColumn: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onToggleMenu: () => void;
  onMenuAction: (action: string) => void;
  onExpand: () => void;
  children: React.ReactNode;
}) {
  const isMenuOpen = activeMenuColumn === columnKey;

  return (
    <div
      className={`bg-muted/70 border border-border border-t-4 ${accentBorder} rounded-2xl p-4 flex flex-col gap-4 min-h-125`}
    >
      {/* ── Column Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {/* shadcn Badge — column project count */}
          <Badge
            className={`px-2 py-0.5 text-xs font-bold rounded-full ${badgeBg}`}
          >
            {count}
          </Badge>
        </div>

        {/* ── Feature 4: Column Menu Button with Dropdown ──────────────────── */}
        <div className="relative" ref={isMenuOpen ? menuRef : undefined}>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={onToggleMenu}
            title="Column options"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {/* Dropdown menu — only renders for the active column */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-top-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 cursor-pointer"
                  onClick={() => onMenuAction(opt.value)}
                >
                  {opt.value === "priority" && (
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  )}
                  {opt.value === "dueDate" && (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  {opt.value === "collapse" && (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Feature 6: Collapsed state — show expand button ────────────────── */}
      {collapsed ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <p className="text-xs text-muted-foreground">
            {count} project{count !== 1 ? "s" : ""} hidden
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs cursor-pointer"
            onClick={onExpand}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Expand Column
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">{children}</div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECT CARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
// NOTE: RouterNavigation was previously rendered inside each card — that was a
// bug. It has been removed here. RouterNavigation should only live at the page
// level if needed.
function ProjectCard({
  project,
  isOverdue = false,
}: {
  project: BoardProject;
  isOverdue?: boolean;
}) {
  return (
    // ── Feature 3: Card wraps in Link for navigation to project detail ─────
    <Link href={`/dashboard/projects/${project.id}`} className="block">
      {/* ── Feature 5: Drag cursor hint + tooltip ──────────────────────────── */}
      <Card
        className="rounded-xl shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <CardContent className="p-4 space-y-4">
          {/* Key Tag & Priority */}
          <div className="flex items-center justify-between text-xs">
            {/* Feature 5: Subtle drag indicator */}
            <span className="flex items-center gap-1 font-mono text-muted-foreground font-medium">
              <GripVertical className="w-3 h-3 opacity-40" />
              {project.key}
            </span>
            {/* shadcn Badge — priority indicator */}
            <Badge
              variant="outline"
              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                project.priority === "Urgent"
                  ? "bg-rose-50 text-rose-600 border-rose-200/80"
                  : project.priority === "High"
                    ? "bg-amber-50 text-amber-600 border-amber-200/80"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {project.priority}
            </Badge>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-sm font-bold text-foreground leading-snug">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Progress Bar — shadcn Progress */}
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              className={`h-1.5 ${
                isOverdue ? "[&>div]:bg-rose-500" : "[&>div]:bg-primary"
              }`}
            />
          </div>

          {/* Roles Breakdown */}
          <div className="pt-2 border-t border-border text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-muted-foreground">PM:</span>
              <span className="font-semibold">
                {project.projectManager.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-muted-foreground">Team Lead:</span>
              <span className="font-semibold">{project.teamLead.name}</span>
            </div>
          </div>

          {/* Footer: Due Date & Developers Avatars */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                isOverdue
                  ? "text-rose-600 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.dueDate}</span>
            </div>

            {/* Developers Avatar Stack — shadcn Avatars */}
            <div className="flex items-center -space-x-1.5">
              {project.developers.map((dev, idx) => (
                <Avatar
                  key={idx}
                  title={`Developer: ${dev.name}`}
                  className="w-6 h-6 border-2 border-white"
                >
                  <AvatarFallback className="bg-primary/15 text-[9px] font-bold text-primary">
                    {dev.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
