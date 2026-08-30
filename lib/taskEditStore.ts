"use client";

import { useSyncExternalStore } from "react";
import type { Subtask } from "@/data/tasks";

/* ── localStorage key + cross-component sync event ──
   Shared by the Edit Task modal, the Kanban board and the My Tasks page so a
   status change made anywhere is picked up everywhere (and across tabs). */
export const LS_TASK_EDITS_KEY = "dashboard_edited_tasks";
export const TASK_EDITS_EVENT = "dashboard:task-edited";

/* ── The patch shape persisted per task id ── */
export interface TaskEditOverride {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  dependency?: string | null;
  subtasks?: Subtask[];
  updatedAt?: string;
}

function parseRecord(raw: string | null): Record<string, TaskEditOverride> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, TaskEditOverride>)
      : {};
  } catch {
    return {};
  }
}

function readRecord(): Record<string, TaskEditOverride> {
  try {
    return parseRecord(localStorage.getItem(LS_TASK_EDITS_KEY));
  } catch {
    return {};
  }
}

/* ── External store (localStorage + custom event + cross-tab writes) ──
   The snapshot reference is cached by the raw localStorage string so it stays
   stable between renders (required by useSyncExternalStore). */
let cachedRaw: string | null = null;
let cachedValue: Record<string, TaskEditOverride> = {};

function getSnapshot(): Record<string, TaskEditOverride> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(LS_TASK_EDITS_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseRecord(raw);
  }
  return cachedValue;
}

const getServerSnapshot = () => ({});

function subscribe(callback: () => void) {
  window.addEventListener(TASK_EDITS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(TASK_EDITS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** React hook exposing the persisted task-edit patches, synced app-wide. */
export function useTaskEditOverrides(): Record<string, TaskEditOverride> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Merges a patch into the stored record for one task and notifies listeners. */
export function writeTaskEdit(id: string, patch: TaskEditOverride) {
  const record = readRecord();
  record[id] = { ...record[id], ...patch };
  try {
    localStorage.setItem(LS_TASK_EDITS_KEY, JSON.stringify(record));
  } catch {
    /* localStorage unavailable – ignore */
  }
  window.dispatchEvent(new CustomEvent(TASK_EDITS_EVENT, { detail: record }));
}
