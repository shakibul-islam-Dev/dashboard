/* Pure task-dependency helpers (no React, no I/O) so they stay easy to unit-test.

   A task may optionally reference another task it depends on ("blocked by").
   References are free-form strings — a task id ("TASK-102") or a title
   ("Configure authentication") — because that is what the create/edit modals
   capture. Resolution is case-insensitive and falls back to substring matches
   so partial input still finds the prerequisite. */

export type DependencyLookupTask = {
  id: string;
  title: string;
  status: string;
};

export interface DependencyRef {
  /** The prerequisite's task id (or the raw reference when unresolved). */
  code: string;
  title: string;
  status: string;
}

const normalize = (value: string) => value.trim().toLowerCase();

/** Trims whatever the user typed into a "blocked by" field; null when empty. */
export function parseDependencyReference(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Resolve a dependency reference against stored task data.
    Exact id/title matches win; substring matches are the fallback.
    `excludeId` guards against a task depending on itself. */
export function findDependencyTask<T extends DependencyLookupTask>(
  reference: string | null | undefined,
  tasks: T[],
  excludeId?: string,
): T | undefined {
  const ref = parseDependencyReference(reference);
  if (!ref) return undefined;

  const pool = excludeId ? tasks.filter((t) => t.id !== excludeId) : tasks;
  const q = normalize(ref);

  const exact = pool.find(
    (t) => normalize(t.id) === q || normalize(t.title) === q,
  );
  if (exact) return exact;

  return pool.find((t) => {
    const id = normalize(t.id);
    const title = normalize(t.title);
    return title.includes(q) || q.includes(title) || id.includes(q);
  });
}

/** A prerequisite only counts as satisfied when the resolved task is Done. */
export function isDependencyComplete(
  prerequisite: DependencyLookupTask | undefined,
): boolean {
  return !!prerequisite && prerequisite.status === "Done";
}

export interface DependencyGateResult {
  /** The prerequisite blocking the move — live status from stored task data. */
  prerequisite: DependencyRef;
}

/** Decide whether moving a task to `nextStatus` should be blocked by an
    incomplete dependency. Returns blocking info when a warning must be shown,
    or null when the move is safe (no dependency, or the dependency is Done). */
export function evaluateDependencyGate(options: {
  dependency: string | null | undefined;
  tasks: DependencyLookupTask[];
  nextStatus: string;
  selfId?: string;
}): DependencyGateResult | null {
  const { dependency, tasks, nextStatus, selfId } = options;
  if (nextStatus !== "Done") return null;

  const ref = parseDependencyReference(dependency);
  if (!ref) return null;

  const resolved = findDependencyTask(ref, tasks, selfId);
  if (isDependencyComplete(resolved)) return null;

  return {
    prerequisite: resolved
      ? { code: resolved.id, title: resolved.title, status: resolved.status }
      : { code: ref, title: "Dependency not found", status: "Unresolved" },
  };
}
