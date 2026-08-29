"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ── localStorage-backed user profile (avatar + identity fields) ──
   Follows the same store pattern as customStore: a cached snapshot
   keyed by the raw localStorage string, synced via a custom event
   plus cross-tab "storage" events. */

export interface UserProfileData {
  fullName: string;
  jobTitle: string;
  bio: string;
  /** Data URL of the uploaded picture ("" when none). */
  avatar: string;
}

const LS_PROFILE_KEY = "taskboard_user_profile";
const PROFILE_EVENT = "taskboard:profile-updated";

const EMPTY_PROFILE: UserProfileData = {
  fullName: "",
  jobTitle: "",
  bio: "",
  avatar: "",
};

/* ── Parsing (pure — unit-testable) ── */
export function parseProfile(raw: string | null): UserProfileData {
  if (!raw) return { ...EMPTY_PROFILE };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...EMPTY_PROFILE };
    }
    const record = parsed as Record<string, unknown>;
    const str = (key: keyof UserProfileData) =>
      typeof record[key] === "string" ? (record[key] as string) : "";
    return {
      fullName: str("fullName"),
      jobTitle: str("jobTitle"),
      bio: str("bio"),
      avatar: str("avatar"),
    };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

function readProfile(): UserProfileData {
  try {
    return parseProfile(localStorage.getItem(LS_PROFILE_KEY));
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

/* ── External store ── */
const profileListeners = new Set<() => void>();

function subscribeProfile(listener: () => void): () => void {
  profileListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener(PROFILE_EVENT, listener);
    window.addEventListener("storage", listener);
  }
  return () => {
    profileListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener(PROFILE_EVENT, listener);
      window.removeEventListener("storage", listener);
    }
  };
}

let cachedProfileRaw: string | null = null;
let cachedProfile: UserProfileData = { ...EMPTY_PROFILE };

function getProfileSnapshot(): UserProfileData {
  const raw = localStorage.getItem(LS_PROFILE_KEY);
  if (raw !== cachedProfileRaw) {
    cachedProfileRaw = raw;
    cachedProfile = parseProfile(raw);
  }
  return cachedProfile;
}

function getServerProfileSnapshot(): UserProfileData {
  return EMPTY_PROFILE;
}

function persistProfile(next: UserProfileData) {
  try {
    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(next));
  } catch {
    /* quota exceeded / unavailable — keep the in-memory value in sync anyway */
  }
  cachedProfileRaw = null; // force re-read on next snapshot
  profileListeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROFILE_EVENT));
  }
}

/** Merges a patch into the stored profile and notifies every listener. */
export function saveProfile(patch: Partial<UserProfileData>) {
  persistProfile({ ...readProfile(), ...patch });
}

/** Reactive profile hook — empty profile until hydrated on the client. */
export function useProfile(): UserProfileData {
  return useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getServerProfileSnapshot,
  );
}

/** Removes the stored avatar (keeps the other fields). */
export function useAvatarUpload() {
  const profile = useProfile();

  const setAvatar = useCallback(async (file: File) => {
    const error = validateImageFile(file);
    if (error) throw new Error(error);
    const dataUrl = await fileToSquareDataUrl(file, 256);
    saveProfile({ avatar: dataUrl });
    return dataUrl;
  }, []);

  const clearAvatar = useCallback(() => {
    saveProfile({ avatar: "" });
  }, []);

  return { profile, setAvatar, clearAvatar };
}

/* ── Image upload helpers ── */

/** Max accepted raw file size (the stored copy is downscaled to ~256px). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Returns an error message for invalid files, or null when acceptable. */
export function validateImageFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file (PNG, JPG, WebP, GIF…).";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image is too large — please keep it under 5 MB.";
  }
  return null;
}

/** "Alex Morgan" → "AM", "Shakibul" → "S", "" → "?" */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the image."));
    img.src = src;
  });
}

/**
 * Reads an image file and returns a downscaled, center-cropped square JPEG
 * data URL (keeps localStorage small — raw uploads can be several MB).
 * Falls back to the original data URL when a canvas is unavailable.
 */
export async function fileToSquareDataUrl(
  file: File,
  size = 256,
): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);

  try {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;

    // Center-crop to a square, then scale down.
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;

    ctx.fillStyle = "#ffffff"; // flatten transparency for JPEG
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return dataUrl;
  }
}
