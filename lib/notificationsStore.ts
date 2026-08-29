"use client";

import { useSyncExternalStore } from "react";
import {
  dropdownNotifications as seedNotifications,
  type DropdownNotification,
} from "@/data/notifications";

/* ── localStorage key + cross-component sync event ── */
const NOTIFS_KEY = "dashboard_notifications";
const NOTIFS_EVENT = "dashboard:notifications-updated";

/* ── Read helpers ── */
function readNotifications(): DropdownNotification[] {
  if (typeof window === "undefined") return seedNotifications;
  try {
    const raw = localStorage.getItem(NOTIFS_KEY);
    if (raw === null) return seedNotifications;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? (parsed as DropdownNotification[])
      : seedNotifications;
  } catch {
    return seedNotifications;
  }
}

function writeNotifications(items: DropdownNotification[]) {
  try {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(items));
  } catch {
    /* localStorage unavailable – ignore */
  }
  window.dispatchEvent(new CustomEvent(NOTIFS_EVENT, { detail: items }));
}

/* ── External store: one shared feed for the bell dropdown, the nav
      badge and the full /dashboard/notifications page. ── */
let cachedRaw: string | null = null;
let cachedValue: DropdownNotification[] = seedNotifications;

function subscribe(callback: () => void) {
  const onEvent = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === NOTIFS_KEY) callback();
  };
  window.addEventListener(NOTIFS_EVENT, onEvent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(NOTIFS_EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): DropdownNotification[] {
  const raw = localStorage.getItem(NOTIFS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = readNotifications();
  }
  return cachedValue;
}

const getServerSnapshot = (): DropdownNotification[] => seedNotifications;

export function useNotifications() {
  const notifications = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const markRead = (id: string) =>
    writeNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  const markUnread = (id: string) =>
    writeNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: true } : n)),
    );

  const markAllRead = () =>
    writeNotifications(notifications.map((n) => ({ ...n, unread: false })));

  const removeNotification = (id: string) =>
    writeNotifications(notifications.filter((n) => n.id !== id));

  const clearAll = () => writeNotifications([]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return {
    notifications,
    markRead,
    markUnread,
    markAllRead,
    removeNotification,
    clearAll,
    unreadCount,
  };
}