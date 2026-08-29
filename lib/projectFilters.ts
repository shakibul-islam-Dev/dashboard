/* Pure project filter/sort helpers shared by the Projects page and the
   Project Board. No React, no I/O — easy to unit-test. */

import { parseDueDate } from "./taskFilters";

export type ProjectTab = "All" | "Active" | "Completed" | "Paused" | "Archived";
export type ProjectSort = "modified" | "name" | "progress";

type FilterableProject = {
  title: string;
  description: string;
  status: string;
  progress: number;
};

/* Projects page pipeline: search → tab filter → sort.
   - Active:    In Progress or Review
   - Completed: status "Completed" or 100% progress
   - Paused:    Planning, On Hold or Blocked
   - Archived/All: caller passes the right source list. */
export function filterAndSortProjects<T extends FilterableProject>(
  projects: T[],
  tab: ProjectTab,
  search: string,
  sort: ProjectSort,
): T[] {
  const query = search.trim().toLowerCase();

  let result = projects;
  if (query) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  }

  if (tab === "Active") {
    result = result.filter(
      (p) => p.status === "In Progress" || p.status === "Review",
    );
  } else if (tab === "Completed") {
    result = result.filter(
      (p) => p.status === "Completed" || p.progress === 100,
    );
  } else if (tab === "Paused") {
    result = result.filter(
      (p) =>
        p.status === "Planning" ||
        p.status === "On Hold" ||
        p.status === "Blocked",
    );
  }

  const sorted = [...result];
  if (sort === "name") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "progress") {
    sorted.sort((a, b) => b.progress - a.progress);
  }
  return sorted;
}

/* ── Project Board column sorting ── */

const PRIORITY_WEIGHT: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Normal: 3,
};

export type BoardSortBy = "priority" | "dueDate" | null;

/* Sorts a board column by priority (Urgent → Normal) or by due date
   chronologically ("Aug 15" style strings, not alphabetically). */
export function sortBoardProjects<
  T extends { priority: string; dueDate: string },
>(list: T[], sortBy: BoardSortBy): T[] {
  if (!sortBy) return list;
  const sorted = [...list];
  if (sortBy === "priority") {
    sorted.sort(
      (a, b) =>
        (PRIORITY_WEIGHT[a.priority] ?? 99) - (PRIORITY_WEIGHT[b.priority] ?? 99),
    );
  } else {
    sorted.sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate));
  }
  return sorted;
}
