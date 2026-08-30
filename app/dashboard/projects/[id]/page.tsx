"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Columns3,
  Download,
  FilePlus2,
  FileText,
  Flag,
  FolderKanban,
  ListTodo,
  PenTool,
  Plus,
  Presentation,
  RefreshCw,
  Table2,
  Trash2,
  Users,
  Zap,
} from "lucide-react";

/* Data & store */
import {
  projectsPageData as initialProjects,
  projectBoardData,
  getProjectDetails,
  getProjectFiles,
  getProjectMilestones,
  type Project,
  type BoardProject,
  type ProjectFile,
  type ProjectFileType,
  type ProjectMilestone,
} from "@/data/projects";
import {
  createTaskDefaults,
  projectStatusOptions,
} from "@/data/tasks";
import {
  useCustomProjects,
  customProjectToProject,
  useCustomTasks,
  useIdSet,
  useProjectEditOverrides,
  writeProjectEdit,
  updateIdSet,
  LS_ARCHIVED_PROJECTS_KEY,
  LS_DELETED_PROJECTS_KEY,
  LS_DELETED_TASKS_KEY,
  type ProjectEditOverride,
} from "@/lib/customStore";
import {
  useProjectTasks,
  type ProjectTask,
} from "@/lib/useProjectTasks";
import {
  evaluateDependencyGate,
  type DependencyRef,
} from "@/lib/dependency";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import CreateTaskModal from "@/components/customsUi/CreateTaskModal";
import TaskDetailModal from "@/components/customsUi/TaskDetailModal";
import EditTaskModal from "@/components/customsUi/EditTaskModal";
import KanbanBoard from "@/components/customsUi/KanbanBoard";
import DependencyIncompleteModal from "@/components/customsUi/DependencyIncompleteModal";

/* shadcn UI components */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DetailTask = ProjectTask;

type DetailMember = {
  name: string;
  role: string;
  avatar?: string;
  fallback?: string;
};

type ResolvedProject = Project & { hoursLogged?: number };

/* File-type → icon + badge colors for the Files & Docs tab. */
const FILE_TYPE_META: Record<
  ProjectFileType,
  { icon: typeof FileText; color: string }
> = {
  PDF: { icon: FileText, color: "bg-rose-50 text-rose-600" },
  DOCX: { icon: FileText, color: "bg-slate-100 text-slate-600" },
  FIG: { icon: PenTool, color: "bg-purple-50 text-purple-600" },
  XLSX: { icon: Table2, color: "bg-emerald-50 text-emerald-600" },
  SLIDE: { icon: Presentation, color: "bg-orange-50 text-orange-600" },
  TXT: { icon: FileText, color: "bg-slate-100 text-slate-600" },
};

/* Legacy mock statuses ("Completed") are mapped to board statuses by
   useProjectTasks (Todo / In Progress / Review / Done). */

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { projects: customProjects, updateProject } = useCustomProjects();
  const { removeTask } = useCustomTasks();
  const archivedSet = useIdSet(LS_ARCHIVED_PROJECTS_KEY);
  const deletedSet = useIdSet(LS_DELETED_PROJECTS_KEY);
  const deletedTasks = useIdSet(LS_DELETED_TASKS_KEY);
  const editOverrides = useProjectEditOverrides();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailTask, setDetailTask] = useState<DetailTask | null>(null);

  /* ── Edit Task modal target (opened from the Task Detail pencil icon) ── */
  const [editTarget, setEditTarget] = useState<
    {
      id: string;
      title: string;
      status: string;
      priority: string;
      assignee?: string;
      dueDate: string;
      tags: string[];
      dependency?: string | null;
    } | null
  >(null);
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
  const [showEditModal, setShowEditModal] = useState(false);

  /* ── Tasks tab view mode: list or Kanban board ── */
  const [taskView, setTaskView] = useState<"list" | "board">("list");

  /* ── Flatten board projects into the Project shape so /p1..p5 resolve too ── */
  const boardProjectsAsProjects = useMemo<Project[]>(
    () =>
      Object.values(projectBoardData)
        .flat()
        .map((bp) => ({
          id: bp.id,
          title: bp.title,
          description: bp.description,
          status:
            bp.priority === "High" || bp.priority === "Urgent"
              ? "In Progress"
              : "Planning",
          statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
          borderColor: "border-l-blue-500",
          progressColor: "bg-blue-600",
          date: bp.dueDate,
          progress: bp.progress,
          completedTasks: 0,
          totalTasks: 0,
          icon: FolderKanban,
          iconBg: "bg-blue-50 text-blue-600",
          avatars: [
            bp.projectManager.avatar,
            bp.teamLead.avatar,
            ...bp.developers.map((d) => d.avatar),
          ],
        })),
    [],
  );

  /* ── Resolve the project from every source (never 404 for a known id) ── */
  const project = useMemo(() => {
    if (!projectId) return null;

    const merged = [
      ...initialProjects,
      ...boardProjectsAsProjects,
      ...customProjects.map(customProjectToProject),
    ].map((p) => {
      const override: ProjectEditOverride | undefined = editOverrides[p.id];
      if (!override) return p;
      return {
        ...p,
        title: override.title ?? p.title,
        description: override.description ?? p.description,
        status: override.status ?? p.status,
      };
    });

    const found = merged.find(
      (p) =>
        p.id === projectId &&
        !deletedSet.has(p.id) &&
        !archivedSet.has(p.id),
    );
    if (found) return found;

    // Fallback: synthesize a detail view from the legacy helper so any route shows content.
    const legacy = getProjectDetails(projectId);
    return {
      id: legacy.id,
      title: legacy.title,
      description: legacy.description,
      status: legacy.status,
      statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      borderColor: "border-l-blue-500",
      progressColor: "bg-blue-600",
      date: legacy.dueDate,
      progress: legacy.progress,
      completedTasks: legacy.stats.completedTasks,
      totalTasks: legacy.stats.totalTasks,
      hoursLogged: legacy.stats.hoursLogged,
      icon: FolderKanban,
      iconBg: "bg-blue-50 text-blue-600",
      avatars: legacy.members.map((m) => m.fallback),
    };
  }, [
    projectId,
    boardProjectsAsProjects,
    customProjects,
    editOverrides,
    deletedSet,
    archivedSet,
  ]);

  /* ── Unified task list: seeded + custom + legacy fallback, edits applied ──
     (statuses persist via the task store / edit overrides) */
  const { tasks: hookTasks, setTaskStatus } = useProjectTasks(
    project?.id,
    project?.title,
  );

  const projectTasks = useMemo<DetailTask[]>(
    () => hookTasks.filter((t) => !deletedTasks.has(t.id)),
    [hookTasks, deletedTasks],
  );

  const completedCount = projectTasks.filter((t) => t.status === "Done").length;
  const totalCount = projectTasks.length;

  const stats = useMemo(() => {
    const hasTasks = totalCount > 0;
    const total = hasTasks ? totalCount : (project?.totalTasks ?? 0);
    const completed = hasTasks ? completedCount : (project?.completedTasks ?? 0);
    return {
      progress: hasTasks
        ? Math.round((completed / total) * 100)
        : (project?.progress ?? 0),
      completed,
      total,
    };
  }, [project, totalCount, completedCount]);

  /* ── Mock hours logged (from getProjectDetails when the project has none) ── */
  const hoursLogged = useMemo(
    () =>
      project
        ? (project as ResolvedProject).hoursLogged ??
          getProjectDetails(project.id).stats.hoursLogged
        : 0,
    [project],
  );

  /* ── Team derived from task assignees + full mock members (name + role) ── */
  const team = useMemo(() => {
    if (!project) return { avatars: [] as string[], assignees: [] as string[] };
    return {
      avatars: project.avatars ?? [],
      assignees: Array.from(
        new Set(
          projectTasks
            .map((t) => t.assignee)
            .filter((a): a is string => Boolean(a)),
        ),
      ),
    };
  }, [project, projectTasks]);

  /* ── Team members grid (mock data with names + roles) ── */
  const members = useMemo<DetailMember[]>(() => {
    if (!project) return [];

    // Board projects (p1..p5) carry real member roles.
    const board = (Object.values(projectBoardData).flat() as BoardProject[]).find(
      (bp) => bp.id === project.id,
    );
    if (board) {
      return [
        {
          name: board.projectManager.name,
          role: "Project Manager",
          avatar: board.projectManager.avatar,
        },
        {
          name: board.teamLead.name,
          role: "Team Lead",
          avatar: board.teamLead.avatar,
        },
        ...board.developers.map((d) => ({
          name: d.name,
          role: "Developer",
          avatar: d.avatar,
        })),
      ];
    }

    // Static / fallback projects → the classic mock team.
    return getProjectDetails(project.id).members.map((m) => ({
      name: m.name,
      role: m.role,
      avatar: m.avatar,
      fallback: m.fallback,
    }));
  }, [project]);

  /* ── Mock files / milestones (per project, from the data helpers) ── */
  const files = useMemo<ProjectFile[]>(
    () => (project ? getProjectFiles(project.id) : []),
    [project],
  );

  const milestones = useMemo<ProjectMilestone[]>(
    () => (project ? getProjectMilestones(project.id) : []),
    [project],
  );

  const milestoneStats = useMemo(() => {
    const done = milestones.filter((m) => m.status === "Completed").length;
    const active = milestones.filter((m) => m.status === "In Progress").length;
    const progress =
      milestones.length > 0
        ? Math.round((done / milestones.length) * 100)
        : 0;
    return { done, active, progress };
  }, [milestones]);

  /* ── Recent activity feed (derived from the project's own data) ── */
  const recentActivity = useMemo(() => {
    if (!project) return [];

    type FeedItem = {
      id: string;
      icon: typeof CheckCircle2;
      iconBg: string;
      text: string;
      time: string;
    };
    const items: FeedItem[] = [];

    projectTasks
      .filter((t) => t.status === "Done")
      .slice(0, 3)
      .forEach((t) =>
        items.push({
          id: `task-${t.id}`,
          icon: CheckCircle2,
          iconBg: "bg-emerald-500",
          text: `${t.assignee || "A team member"} completed "${t.title}"`,
          time: "Today",
        }),
      );

    milestones
      .filter((m) => m.status === "In Progress")
      .slice(0, 2)
      .forEach((m) =>
        items.push({
          id: `ms-${m.id}`,
          icon: RefreshCw,
          iconBg: "bg-blue-500",
          text: `Milestone "${m.title}" is in progress`,
          time: `Due ${m.date}`,
        }),
      );

    files.slice(0, 3).forEach((f) =>
      items.push({
        id: `file-${f.id}`,
        icon: FilePlus2,
        iconBg: "bg-purple-500",
        text: `${f.author} uploaded "${f.name}"`,
        time: f.updatedAt,
      }),
    );

    return items;
  }, [project, projectTasks, milestones, files]);

  /* ── Task actions (custom tasks update the store; seeded ones get persisted overrides) ── */

  /* Any move to Done passes the dependency gate first: the prerequisite's
     live status is resolved from this project's stored task data. */
  const [pendingMove, setPendingMove] = useState<{
    id: string;
    status: string;
    prerequisite: DependencyRef;
  } | null>(null);

  const requestStatusChange = useCallback(
    (id: string, status: string) => {
      const task = projectTasks.find((t) => t.id === id);
      if (!task || task.status === status) return;

      const gate = evaluateDependencyGate({
        dependency: task.dependency,
        tasks: projectTasks,
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
    },
    [projectTasks, setTaskStatus],
  );

  const confirmPendingMove = () => {
    if (!pendingMove) return;
    const task = projectTasks.find((t) => t.id === pendingMove.id);
    setTaskStatus(pendingMove.id, pendingMove.status);
    setPendingMove(null);
    toast.success("Status updated", {
      description: `"${task?.title ?? "Task"}" moved to ${pendingMove.status}.`,
    });
  };

  const toggleTaskDone = (task: DetailTask) => {
    const next = task.status === "Done" ? "In Progress" : "Done";
    requestStatusChange(task.id, next);
  };

  const deleteTask = (task: DetailTask) => {
    if (task.custom) {
      removeTask(task.id);
    } else {
      updateIdSet(LS_DELETED_TASKS_KEY, task.id, true);
    }
    toast.success("Task deleted", {
      description: `"${task.title}" removed from this project.`,
    });
  };

  /* ── Project status change (persisted via the shared overrides store) ── */
  const changeProjectStatus = (status: string) => {
    if (!project) return;
    if (customProjects.some((p) => p.id === project.id)) {
      updateProject(project.id, { status });
    } else {
      writeProjectEdit(project.id, { status });
    }
    toast.success("Project status updated", { description: `Status set to ${status}.` });
  };

  /* ── Empty (project not found / deleted) state ── */
  if (!project) {
    return (
      <PageContainer className="space-y-6">
        <PageNav />
        <Card className="border-border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <FileText className="w-10 h-10 text-muted-foreground" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Project not found
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This project doesn&apos;t exist, or it was archived or deleted.
              </p>
            </div>
            <Link href="/dashboard/projects">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageNav />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col gap-4"
      >
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Select value={project.status} onValueChange={(v) => v && changeProjectStatus(v)}>
              <SelectTrigger className="gap-1.5 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projectStatusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Task
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 24 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Overall Progress
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.progress}%
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Tasks Completed
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.completed} / {stats.total}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Target Completion
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {project.date}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Logged Hours
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {hoursLogged} hrs
              </h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks" className="w-full space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 24 }}
          className="overflow-x-auto -mx-1 px-1 pb-1"
        >
          <TabsList className="bg-card border border-border p-1 rounded-lg min-w-max">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" /> Tasks
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Team Members
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <Flag className="w-4 h-4" /> Milestones
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Files & Docs
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Activity
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-foreground">
                Project Tasks
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {totalCount > 0
                    ? `${completedCount} of ${totalCount} done`
                    : `${stats.completed} of ${stats.total} done`}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* View toggle: List ↔ Kanban board */}
                <div
                  className="flex items-center rounded-lg border border-border p-0.5"
                  role="group"
                  aria-label="Task view mode"
                >
                  <Button
                    variant={taskView === "list" ? "secondary" : "ghost"}
                    size="icon-xs"
                    title="List view"
                    aria-label="List view"
                    aria-pressed={taskView === "list"}
                    className="cursor-pointer"
                    onClick={() => setTaskView("list")}
                  >
                    <ListTodo className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant={taskView === "board" ? "secondary" : "ghost"}
                    size="icon-xs"
                    title="Board view"
                    aria-label="Board view"
                    aria-pressed={taskView === "board"}
                    className="cursor-pointer"
                    onClick={() => setTaskView("board")}
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </Button>
              </div>
            </CardHeader>

            {totalCount > 0 && (
              <CardContent className="pt-2">
                <Progress value={stats.progress} className="h-1.5 bg-muted" />
              </CardContent>
            )}

            {taskView === "board" ? (
              /* ── Kanban Board view: Todo / In Progress / Review / Done ── */
              <CardContent className="pt-4">
                <KanbanBoard
                  tasks={projectTasks}
                  onStatusChange={requestStatusChange}
                  onOpenTask={(task) =>
                    setDetailTask(
                      projectTasks.find((t) => t.id === task.id) ?? null,
                    )
                  }
                />
              </CardContent>
            ) : (
            <CardContent className="p-0">
              {projectTasks.length === 0 ? (
                <div className="py-14 text-center text-muted-foreground">
                  <ListTodo className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    No tasks in this project yet.
                  </p>
                  <p className="text-xs mt-1">
                    Click &quot;Add Task&quot; to create the first one.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {projectTasks.map((task) => {
                      const done = task.status === "Done";
                      return (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                          className="p-4 flex items-center justify-between gap-3 flex-wrap hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Checkbox
                              checked={done}
                              onCheckedChange={() => toggleTaskDone(task)}
                              className="mt-0.5 shrink-0 cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setDetailTask(task)}
                              className="min-w-0 text-left"
                            >
                              <p
                                className={`text-sm truncate ${
                                  done
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground font-medium"
                                }`}
                              >
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {task.assignee || "Unassigned"}
                                {task.dueDate
                                  ? ` · Due ${task.dueDate}`
                                  : ""}
                              </p>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Select
                              value={task.status}
                              onValueChange={(v) =>
                                v && requestStatusChange(task.id, v)
                              }
                            >
                              <SelectTrigger className="h-7 text-xs shadow-none gap-1 px-2.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {createTaskDefaults.statuses.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete task"
                              className="hover:bg-rose-500/10 hover:text-rose-600 text-muted-foreground"
                              onClick={() => deleteTask(task)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Assigned Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 && team.assignees.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No team members yet.</p>
                  <p className="text-xs mt-1">
                    Team members appear here once tasks are assigned.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <div
                        key={member.name}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
                      >
                        <Avatar>
                          {member.avatar &&
                          (member.avatar.startsWith("http") ||
                            member.avatar.startsWith("/")) ? (
                            <>
                              <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                              />
                              <AvatarFallback className="text-[10px] font-semibold">
                                {member.fallback ??
                                  member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                              </AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="text-[10px] font-semibold">
                              {member.avatar ??
                                member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {team.assignees.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        Assignees
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {team.assignees.map((name) => (
                          <Badge key={name} variant="secondary" className="gap-1.5 font-medium">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[8px] font-bold">
                              {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base font-bold text-foreground">
                Roadmap / Milestones
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {milestoneStats.done} of {milestones.length} complete
                </span>
                <span className="text-muted-foreground">
                  ({milestoneStats.progress}%)
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={milestoneStats.progress} className="h-1.5 bg-muted mb-5" />
              {milestones.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <Flag className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No milestones yet.</p>
                </div>
              ) : (
                <ol className="relative space-y-5 border-l border-border ml-2.5">
                  {milestones.map((m) => {
                    const done = m.status === "Completed";
                    const active = m.status === "In Progress";
                    return (
                      <li key={m.id} className="relative pl-7">
                        <span
                          className={`absolute -left-[7px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                            done
                              ? "bg-emerald-500 border-emerald-500"
                              : active
                                ? "bg-primary border-primary animate-pulse"
                                : "bg-card border-border"
                          }`}
                        />
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                active ? "text-foreground" : "text-foreground/90"
                              }`}
                            >
                              {m.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {m.date}
                            </p>
                          </div>
                          <Badge
                            variant={done ? "secondary" : "outline"}
                            className={`gap-1 font-medium ${
                              done
                                ? "text-emerald-700"
                                : active
                                  ? "text-primary"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : active ? (
                              <RefreshCw className="w-3 h-3" />
                            ) : (
                              <Flag className="w-3 h-3" />
                            )}
                            {m.status}
                          </Badge>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files & Docs Tab */}
        <TabsContent value="files">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground">
                Files & Documents
              </CardTitle>
              {files.length > 0 && (
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Upload
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {files.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    No files uploaded yet for project ID: {project.id}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {files.map((file) => {
                    const meta = FILE_TYPE_META[file.type];
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-4 flex-wrap"
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.color} shrink-0`}
                        >
                          <meta.icon className="w-5 h-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {file.type} · {file.size} · by {file.author} ·{" "}
                            {file.updatedAt}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Download className="w-4 h-4" /> Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No recent activity.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-4"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${item.iconBg} shrink-0`}
                      >
                        <item.icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Modal (pre-filled with this project) */}
      <CreateTaskModal
        key={`${project.id}-create`}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        defaultProject={project.title}
      />

      {/* Task Detail Modal (opens from a task row or a board card) */}
      <TaskDetailModal
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onEdit={handleEditTask}
        task={
          detailTask
            ? { ...detailTask, project: project.title }
            : undefined
        }
        dependencyTasks={projectTasks}
      />

      {/* Edit Task Modal (opened via the detail pencil icon) */}
      <EditTaskModal
        key={editTarget?.id ?? "edit"}
        isOpen={showEditModal && !!editTarget}
        onClose={() => setShowEditModal(false)}
        task={editTarget}
        dependencyTasks={projectTasks}
      />

      {/* Dependency Warning – fires when moving a blocked task to Done
          (board drag & drop, keyboard moves or the list status select) */}
      <DependencyIncompleteModal
        isOpen={!!pendingMove}
        onClose={() => setPendingMove(null)}
        onConfirm={confirmPendingMove}
        prerequisite={pendingMove?.prerequisite ?? null}
        targetStatus={pendingMove?.status ?? "Done"}
      />
    </PageContainer>
  );
}