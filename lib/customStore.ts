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

/* ── Lifecycle override keys (archive / delete / project edits) ── */
export const LS_ARCHIVED_TASKS_KEY = "dashboard_archived_tasks";
export const LS_DELETED_TASKS_KEY = "dashboard_deleted_tasks";
export const LS_ARCHIVED_PROJECTS_KEY = "dashboard_archived_projects";
export const LS_DELETED_PROJECTS_KEY = "dashboard_deleted_projects";
export const LS_EDITED_PROJECTS_KEY = "dashboard_edited_projects";

/* ── Cross-component sync events ── */
const TASKS_EVENT = "dashboard:tasks-updated";
const PROJECTS_EVENT = "dashboard:projects-updated";
export const OVERRIDES_EVENT = "dashboard:overrides-updated";

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
function parseItems<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function parseRecord<T>(raw: string | null): Record<string, T> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, T>)
      : {};
  } catch {
    return {};
  }
}

function readItems<T>(key: string): T[] {
  try {
    return parseItems<T>(localStorage.getItem(key));
  } catch {
    return [];
  }
}

function readRecord<T>(key: string): Record<string, T> {
  try {
    return parseRecord<T>(localStorage.getItem(key));
  } catch {
    return {};
  }
}

function persist<T>(key: string, event: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage unavailable – ignore */
  }
  window.dispatchEvent(new CustomEvent(event, { detail: value }));
}

/* ── Generic external store ──
   Syncs React with localStorage, a custom event, and cross-tab writes.
   The snapshot reference is cached by the raw localStorage string so it stays
   stable between renders (required by useSyncExternalStore). */
function createStorageStore<T>(config: {
  key: string;
  event: string;
  parse: (raw: string | null) => T;
  empty: () => T;
}) {
  const { key, event, parse, empty } = config;

  const subscribe = (callback: () => void) => {
    const onEvent = () => callback();
    const onStorage = () => callback();
    window.addEventListener(event, onEvent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(event, onEvent);
      window.removeEventListener("storage", onStorage);
    };
  };

  let cachedRaw: string | null = null;
  let cachedValue = empty();

  const getSnapshot = (): T => {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  };

  const getServerSnapshot = (): T => empty();

  return { subscribe, getSnapshot, getServerSnapshot };
}

const tasksStore = createStorageStore<CustomTask[]>({
  key: LS_TASKS_KEY,
  event: TASKS_EVENT,
  parse: (raw) => parseItems<CustomTask>(raw),
  empty: () => [],
});
const projectsStore = createStorageStore<CustomProject[]>({
  key: LS_PROJECTS_KEY,
  event: PROJECTS_EVENT,
  parse: (raw) => parseItems<CustomProject>(raw),
  empty: () => [],
});

/* ── Tasks store hook ── */
export function useCustomTasks() {
  const tasks = useSyncExternalStore(
    tasksStore.subscribe,
    tasksStore.getSnapshot,
    tasksStore.getServerSnapshot,
  );

  const addTask = useCallback((task: CustomTask) => {
    persist<CustomTask[]>(LS_TASKS_KEY, TASKS_EVENT, [
      ...readItems<CustomTask>(LS_TASKS_KEY),
      task,
    ]);
  }, []);

  const removeTask = useCallback((id: string) => {
    persist<CustomTask[]>(
      LS_TASKS_KEY,
      TASKS_EVENT,
      readItems<CustomTask>(LS_TASKS_KEY).filter((t) => t.id !== id),
    );
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<CustomTask>) => {
    persist<CustomTask[]>(
      LS_TASKS_KEY,
      TASKS_EVENT,
      readItems<CustomTask>(LS_TASKS_KEY).map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      ),
    );
  }, []);

  return { tasks, addTask, removeTask, updateTask };
}

/* ── Projects store hook ── */
export function useCustomProjects() {
  const projects = useSyncExternalStore(
    projectsStore.subscribe,
    projectsStore.getSnapshot,
    projectsStore.getServerSnapshot,
  );

  const addProject = useCallback((project: CustomProject) => {
    persist<CustomProject[]>(LS_PROJECTS_KEY, PROJECTS_EVENT, [
      ...readItems<CustomProject>(LS_PROJECTS_KEY),
      project,
    ]);
  }, []);

  const removeProject = useCallback((id: string) => {
    persist<CustomProject[]>(
      LS_PROJECTS_KEY,
      PROJECTS_EVENT,
      readItems<CustomProject>(LS_PROJECTS_KEY).filter((p) => p.id !== id),
    );
  }, []);

  const updateProject = useCallback(
    (id: string, patch: Partial<CustomProject>) => {
      persist<CustomProject[]>(
        LS_PROJECTS_KEY,
        PROJECTS_EVENT,
        readItems<CustomProject>(LS_PROJECTS_KEY).map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        ),
      );
    },
    [],
  );

  return { projects, addProject, removeProject, updateProject };
}

/* ── Mapping: CustomTask → MyTask (My Tasks page shape) ──
   Date-only ISO strings ("2026-08-29") parse as UTC midnight, which shifts
   the day in non-UTC timezones — normalize to local midnight instead. */
function parseTaskDate(dueDate: string): Date {
  const isoDate = dueDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    return new Date(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
    );
  }
  return new Date(dueDate);
}

function resolveTaskSection(dueDate: string): "OVERDUE" | "TODAY" {
  if (!dueDate.trim()) return "TODAY";
  const parsed = parseTaskDate(dueDate);
  if (Number.isNaN(parsed.getTime())) return "TODAY";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed.getTime() < today.getTime() ? "OVERDUE" : "TODAY";
}

function formatTaskDueDate(dueDate: string): string {
  if (!dueDate.trim()) return "Today";
  const parsed = parseTaskDate(dueDate);
  if (Number.isNaN(parsed.getTime())) return dueDate;
  const today = new Date();
  const isToday =
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate();
  if (isToday) return "Today";
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
export const PROJECT_STYLES: Record<
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

/* ─────────────────────────────────────────────────────────────────────────────
   Lifecycle overrides
   Archive/delete are stored as sets of ids; project edits are stored as a
   per-id patch map. All live under OVERRIDES_EVENT so every listening view
   (My Tasks, Projects, Dashboard) updates in sync.
   ─────────────────────────────────────────────────────────────────────────── */

/* ── Lifecycle override stores (archive/delete sets + project edit map) ──
   Both ride on the shared OVERRIDES_EVENT so every listening view updates. */

const idSetStoresCache = new Map<
  string,
  ReturnType<typeof createStorageStore<Set<string>>>
>();

function getIdSetStore(key: string) {
  let store = idSetStoresCache.get(key);
  if (!store) {
    store = createStorageStore<Set<string>>({
      key,
      event: OVERRIDES_EVENT,
      parse: (raw) => new Set(parseItems<string>(raw)),
      empty: () => new Set<string>(),
    });
    idSetStoresCache.set(key, store);
  }
  return store;
}

export function useIdSet(key: string): Set<string> {
  const store = getIdSetStore(key);
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

/** Adds or removes an id from a persisted lifecycle set (archive/delete). */
export function updateIdSet(key: string, id: string, present: boolean) {
  const set = new Set(readItems<string>(key));
  if (present) set.add(id);
  else set.delete(id);
  persist<string[]>(key, OVERRIDES_EVENT, [...set]);
}

/* ── Project edit overrides (fields edited via the project modal) ── */
export interface ProjectEditOverride {
  title?: string;
  description?: string;
  status?: string;
}

const projectEditsStoreCache = new Map<
  string,
  ReturnType<typeof createStorageStore<Record<string, ProjectEditOverride>>>
>();

function getProjectEditsStore() {
  let store = projectEditsStoreCache.get(LS_EDITED_PROJECTS_KEY);
  if (!store) {
    store = createStorageStore<Record<string, ProjectEditOverride>>({
      key: LS_EDITED_PROJECTS_KEY,
      event: OVERRIDES_EVENT,
      parse: (raw) => parseRecord<ProjectEditOverride>(raw),
      empty: () => ({}),
    });
    projectEditsStoreCache.set(LS_EDITED_PROJECTS_KEY, store);
  }
  return store;
}

export function useProjectEditOverrides(): Record<string, ProjectEditOverride> {
  const store = getProjectEditsStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

/** Persists an edit made to a seeded project (custom projects update the store). */
export function writeProjectEdit(id: string, patch: ProjectEditOverride) {
  const record = readRecord<ProjectEditOverride>(LS_EDITED_PROJECTS_KEY);
  record[id] = { ...record[id], ...patch };
  persist(LS_EDITED_PROJECTS_KEY, OVERRIDES_EVENT, record);
}

export function removeProjectEdit(id: string) {
  const record = readRecord<ProjectEditOverride>(LS_EDITED_PROJECTS_KEY);
  if (!record[id]) return;
  delete record[id];
  persist(LS_EDITED_PROJECTS_KEY, OVERRIDES_EVENT, record);
}
