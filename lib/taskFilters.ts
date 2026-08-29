/* Pure task-filter helpers (no React, no I/O) so they stay easy to unit-test.
   Used by the My Tasks page. */

export type SortableTask = {
  section: string;
  dueDate: string;
  title: string;
  project: string;
  id: string;
};

export type FilterableTask = SortableTask & {
  status: string;
  priority: string;
  tags: string[];
};

export type TaskSection = "ALL" | "OVERDUE" | "TODAY" | "ARCHIVED";

export type DueFilter = "All" | "Today" | "Overdue" | "Upcoming";

export interface TaskFilterOptions {
  search?: string;
  section?: TaskSection;
  status?: string;
  priority?: string;
  project?: string;
  tag?: string;
  due?: DueFilter;
  direction?: "asc" | "desc";
}

/* Loose search: match title, project or id against the query. */
export function matchesSearch<T extends SortableTask>(task: T, query: string) {
  const q = query.toLowerCase();
  return (
    task.title.toLowerCase().includes(q) ||
    task.project.toLowerCase().includes(q) ||
    task.id.toLowerCase().includes(q)
  );
}

/* Due-date sort rank: overdue first, then "Today", then everything else. */
export function dueRank<T extends SortableTask>(task: T) {
  return task.section === "OVERDUE" ? 0 : task.dueDate === "Today" ? 1 : 2;
}

const MONTH_PREFIXES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/* Chronological value for display-style due dates ("Today", "Sep 5",
   "Sep 5, 2027", ISO strings). Unparseable/empty dates sort last. */
export function parseDueDate(dueDate: string): number {
  const raw = dueDate.trim();
  if (!raw) return Number.MAX_SAFE_INTEGER;

  if (/^today$/i.test(raw)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }

  const monthDay = raw.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*(\d{4}))?$/);
  if (monthDay) {
    const month = MONTH_PREFIXES.indexOf(
      monthDay[1].slice(0, 3).toLowerCase(),
    );
    if (month >= 0) {
      const year = monthDay[3]
        ? Number(monthDay[3])
        : new Date().getFullYear();
      return new Date(year, month, Number(monthDay[2])).getTime();
    }
  }

  /* Date-only ISO strings ("2027-02-02") parse as UTC midnight — normalize
     to local midnight so sorting is timezone-independent. */
  const isoDate = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    return new Date(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
    ).getTime();
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

/* Full My Tasks pipeline: search → section → attribute filters → sort.
   "desc" flips the whole comparison (newest due dates first, overdue last). */
export function filterAndSortTasks<T extends FilterableTask>(
  tasks: T[],
  options: TaskFilterOptions = {},
): T[] {
  const {
    search = "",
    section = "ALL",
    status = "All",
    priority = "All",
    project = "All",
    tag = "All",
    due = "All",
    direction = "asc",
  } = options;

  let result = tasks;

  if (search.trim()) {
    result = result.filter((t) => matchesSearch(t, search));
  }

  if (section === "OVERDUE" || section === "TODAY") {
    result = result.filter((t) => t.section === section);
  }

  if (status !== "All") {
    result = result.filter((t) => t.status === status);
  }
  if (priority !== "All") {
    result = result.filter((t) => t.priority === priority);
  }
  if (project !== "All") {
    result = result.filter((t) => t.project === project);
  }
  if (tag !== "All") {
    result = result.filter((t) => t.tags.includes(tag));
  }

  if (due === "Overdue") {
    result = result.filter((t) => t.section === "OVERDUE");
  } else if (due === "Today") {
    result = result.filter(
      (t) => t.section === "TODAY" && t.dueDate === "Today",
    );
  } else if (due === "Upcoming") {
    result = result.filter(
      (t) => t.section === "TODAY" && t.dueDate !== "Today",
    );
  }

  const dir = direction === "desc" ? -1 : 1;

  return [...result].sort((a, b) => {
    const rankDiff = dueRank(a) - dueRank(b);
    if (rankDiff !== 0) return rankDiff * dir;

    const dateDiff = parseDueDate(a.dueDate) - parseDueDate(b.dueDate);
    if (dateDiff !== 0) return dateDiff * dir;

    return a.dueDate.localeCompare(b.dueDate) * dir;
  });
}
