import { useSyncExternalStore } from "react";

export interface StoredUser {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthSession {
  fullName: string;
  email: string;
  role: string;
  loginAt: string;
}

const USERS_KEY = "taskboard-users";
const SESSION_KEY = "taskboard-session";

type AuthResult = { ok: true } | { ok: false; error: string };

const sessionListeners = new Set<() => void>();
let cachedSessionRaw: string | null = null;
let cachedSession: AuthSession | null = null;

function notifySessionChange() {
  sessionListeners.forEach((listener) => listener());
}

export function subscribeSession(listener: () => void): () => void {
  sessionListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    sessionListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function getCurrentSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === cachedSessionRaw) return cachedSession;
    cachedSessionRaw = raw;
    cachedSession = raw ? (JSON.parse(raw) as AuthSession) : null;
    return cachedSession;
  } catch {
    return null;
  }
}

function getServerSession(): AuthSession | null {
  return null;
}

export function useSession(): AuthSession | null {
  return useSyncExternalStore(
    subscribeSession,
    getCurrentSession,
    getServerSession,
  );
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[];
  } catch {
    return [];
  }
}

export function registerUser(
  fullName: string,
  email: string,
  password: string,
): AuthResult {
  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  users.push({ fullName, email, password });
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    return {
      ok: false,
      error: "Could not save your account. Please try again.",
    };
  }
  return { ok: true };
}

export function loginUser(email: string, password: string): AuthResult {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return {
      ok: false,
      error: "No account found with this email. Please register first.",
    };
  }
  if (user.password !== password) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }
  const session: AuthSession = {
    fullName: user.fullName,
    email: user.email,
    role: "Member",
    loginAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return {
      ok: false,
      error: "Could not start your session. Please try again.",
    };
  }
  notifySessionChange();
  return { ok: true };
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    return;
  }
  notifySessionChange();
}
