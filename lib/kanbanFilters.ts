/* Pure Kanban helpers (no React, no I/O) so they stay easy to unit-test.
   Used by the Kanban board views (project workspace + project board page). */

export const KANBAN_STATUSES = ["Todo", "In Progress", "Review", "Done"] as const;
export type KanbanStatus = (typeof KANBAN_STATUSES)[number];

export interface KanbanFilterOptions {
  search?: string;
  priority?: string;
  assignee?: string;
  tag?: string;
}

export type KanbanFilterableTask = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  assignee?: string;
  tags?: string[];
};

/** Maps any status string onto a board column (unknown statuses land in Todo). */
export function toKanbanColumn(status: string): KanbanStatus {
  return (KANBAN_STATUSES as readonly string[]).includes(status)
    ? (status as KanbanStatus)
    : "Todo";
}

/** Loose search: match title, id or assignee against the query. */
export function matchesKanbanSearch<T extends KanbanFilterableTask>(
  task: T,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    task.id.toLowerCase().includes(q) ||
    (task.assignee ? task.assignee.toLowerCase().includes(q) : false)
  );
}

/** Board pipeline: search → priority → assignee → tag. Status is NOT filtered
    here — every task stays visible in its own column. */
export function filterKanbanTasks<T extends KanbanFilterableTask>(
  tasks: T[],
  options: KanbanFilterOptions = {},
): T[] {
  const { search = "", priority = "All", assignee = "All", tag = "All" } =
    options;

  let result = tasks;

  if (search.trim()) {
    result = result.filter((t) => matchesKanbanSearch(t, search));
  }

  if (priority !== "All") {
    result = result.filter((t) => t.priority === priority);
  }

  if (assignee === "Unassigned") {
    result = result.filter((t) => !t.assignee);
  } else if (assignee !== "All") {
    result = result.filter((t) => t.assignee === assignee);
  }

  if (tag !== "All") {
    result = result.filter((t) => (t.tags ?? []).includes(tag));
  }

  return result;
}
