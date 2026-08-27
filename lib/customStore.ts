"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  FolderKanban,
  Rocket,
  Layers,
  Target,
  Package,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { MyTask } from "@/data/tasks";
import type { Project, DashboardProject } from "@/data/projects";

/* ── localStorage keys (shared with the create modals) ── */
export const LS_TASKS_KEY = "dashboard_custom_tasks";
export const LS_PROJECTS_KEY = "dashboard_custom_projects";

/* ── Cross-component sync events ── */
const TASKS_EVENT = "dashboard:tasks-updated";
const PROJECTS_EVENT = "dashboard:projects-updated";

/* ── Types ── */
export interface CustomTask {
  id: string;
  title: string;
  description: string;
  project: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string[];
  dependency: string | null;
  createdAt: string;
}

export interface CustomProjectMember {
  initials: string;
  bg: string;
}

export interface CustomProject {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  teamMembers: CustomProjectMember[];
  createdAt: string;
}

/* ── localStorage helpers ── */
function readItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeItemsAndNotify<T>(key: string, event: string, items: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* localStorage unavailable – ignore */
  }
  window.dispatchEvent(new CustomEvent(event, { detail: items }));
}

/* ── External store: syncs React with localStorage + cross-tab updates ──
   Snapshot is cached by the raw localStorage string so the array reference
   stays stable between renders (required by useSyncExternalStore). */
function createExternalStore<T>(key: string, event: string) {
  const EMPTY: T[] = [];

  const subscribe = (callback: () => void) => {
    const onCustomEvent = () => callback();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === key) callback();
    };
    window.addEventListener(event, onCustomEvent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(event, onCustomEvent);
      window.removeEventListener("storage", onStorage);
    };
  };

  let cachedRaw: string | null = null;
  let cachedValue: T[] = EMPTY;

  const getSnapshot = (): T[] => {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = readItems<T>(key);
    }
    return cachedValue;
  };

  const getServerSnapshot = (): T[] => EMPTY;

  return { subscribe, getSnapshot, getServerSnapshot };
}

const tasksStore = createExternalStore<CustomTask>(LS_TASKS_KEY, TASKS_EVENT);
const projectsStore = createExternalStore<CustomProject>(
  LS_PROJECTS_KEY,
  PROJECTS_EVENT,
);

/* ── Tasks store hook ── */
export function useCustomTasks() {
  const tasks = useSyncExternalStore(
    tasksStore.subscribe,
    tasksStore.getSnapshot,
    tasksStore.getServerSnapshot,
  );

  const addTask = useCallback((task: CustomTask) => {
    writeItemsAndNotify<CustomTask>(
      LS_TASKS_KEY,
      TASKS_EVENT,
      [...readItems<CustomTask>(LS_TASKS_KEY), task],
    );
  }, []);

  return { tasks, addTask };
}

/* ── Projects store hook ── */
export function useCustomProjects() {
  const projects = useSyncExternalStore(
    projectsStore.subscribe,
    projectsStore.getSnapshot,
    projectsStore.getServerSnapshot,
  );

  const addProject = useCallback((project: CustomProject) => {
    writeItemsAndNotify<CustomProject>(
      LS_PROJECTS_KEY,
      PROJECTS_EVENT,
      [...readItems<CustomProject>(LS_PROJECTS_KEY), project],
    );
  }, []);

  return { projects, addProject };
}

/* ── Mapping: CustomTask → MyTask (My Tasks page shape) ── */
function resolveTaskSection(dueDate: string): "OVERDUE" | "TODAY" {
  if (!dueDate.trim()) return "TODAY";
  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return "TODAY";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed.getTime() < today.getTime() ? "OVERDUE" : "TODAY";
}

function formatTaskDueDate(dueDate: string): string {
  if (!dueDate.trim()) return "Today";
  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return dueDate;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function customTaskToMyTask(task: CustomTask): MyTask {
  return {
    id: task.id,
    title: task.title,
    project: task.project || "General",
    status: task.status,
    priority: task.priority,
    dueDate: formatTaskDueDate(task.dueDate),
    tags: task.tags ?? [],
    section: resolveTaskSection(task.dueDate),
  };
}

/* ── Mapping: CustomProject → Project (Projects page shape) ── */
const PROJECT_STYLES: Record<
  string,
  { statusColor: string; borderColor: string; progressColor: string }
> = {
  Planning: {
    statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    borderColor: "border-l-gray-500",
    progressColor: "bg-gray-600",
  },
  "In Progress": {
    statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    borderColor: "border-l-blue-500",
    progressColor: "bg-blue-600",
  },
  "On Hold": {
    statusColor: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    borderColor: "border-l-amber-500",
    progressColor: "bg-amber-500",
  },
  Completed: {
    statusColor: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    borderColor: "border-l-emerald-500",
    progressColor: "bg-emerald-500",
  },
};

const PROJECT_ICONS: { icon: LucideIcon; iconBg: string }[] = [
  { icon: FolderKanban, iconBg: "bg-blue-50 text-blue-600" },
  { icon: Rocket, iconBg: "bg-orange-50 text-orange-600" },
  { icon: Layers, iconBg: "bg-purple-50 text-purple-600" },
  { icon: Target, iconBg: "bg-emerald-50 text-emerald-600" },
  { icon: Package, iconBg: "bg-amber-50 text-amber-600" },
  { icon: Briefcase, iconBg: "bg-rose-50 text-rose-600" },
];

function pickProjectIcon(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return PROJECT_ICONS[hash % PROJECT_ICONS.length];
}

function formatProjectDate(project: CustomProject): string {
  for (const raw of [project.endDate, project.startDate]) {
    if (raw && raw.trim()) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return raw;
    }
  }
  return new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function customProjectToProject(project: CustomProject): Project {
  const styles =
    PROJECT_STYLES[project.status] ?? PROJECT_STYLES["In Progress"];
  const { icon, iconBg } = pickProjectIcon(project.name);

  return {
    id: project.id,
    title: project.name,
    description: project.description || "No description provided.",
    status: project.status,
    statusColor: styles.statusColor,
    borderColor: styles.borderColor,
    progressColor: styles.progressColor,
    date: formatProjectDate(project),
    progress: 0,
    completedTasks: 0,
    totalTasks: 0,
    icon,
    iconBg,
    // Custom projects store member initials instead of avatar image URLs
    avatars: (project.teamMembers ?? []).map((m) => m.initials),
  };
}

/* ── Mapping: CustomProject → DashboardProject (Dashboard shape) ── */
export function customProjectToDashboardProject(
  project: CustomProject,
): DashboardProject {
  return {
    id: project.id,
    title: project.name,
    description: project.description || "No description provided.",
    tag: project.status,
    borderColor:
      (PROJECT_STYLES[project.status] ?? PROJECT_STYLES["In Progress"])
        .borderColor,
    progress: 0,
    date: formatProjectDate(project),
    avatars: (project.teamMembers ?? []).map((m) => m.initials),
  };
}
