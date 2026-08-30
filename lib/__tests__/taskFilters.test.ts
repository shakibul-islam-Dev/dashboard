import { describe, it, expect } from "vitest";
import {
  matchesSearch,
  dueRank,
  parseDueDate,
  filterAndSortTasks,
  type FilterableTask,
} from "../taskFilters";

const task = (over: Partial<FilterableTask>): FilterableTask => ({
  id: "task-1",
  title: "Fix login bug",
  project: "Website Redesign",
  dueDate: "Today",
  section: "TODAY",
  status: "Todo",
  priority: "Medium",
  tags: ["Frontend"],
  ...over,
});

const fixtures: FilterableTask[] = [
  task({ id: "T1", title: "Design hero", section: "OVERDUE", dueDate: "Aug 12", status: "Done", priority: "Low", tags: ["Design"] }),
  task({ id: "T2", title: "Wire auth flow", section: "OVERDUE", dueDate: "Aug 20", status: "In Progress", priority: "Critical", tags: ["Backend", "Security"] }),
  task({ id: "T3", title: "Polish dashboard", section: "TODAY", dueDate: "Today", status: "Todo", priority: "High", tags: ["Frontend"] }),
  task({ id: "T4", title: "Write API docs", section: "TODAY", dueDate: "Sep 18", status: "Review", priority: "Medium", tags: ["Docs"] }),
];

describe("matchesSearch", () => {
  it("matches the title case-insensitively", () => {
    expect(matchesSearch(task({}), "fix login")).toBe(true);
    expect(matchesSearch(task({}), "FIX LOGIN")).toBe(true);
  });

  it("matches the project name and the task id", () => {
    expect(matchesSearch(task({}), "redesign")).toBe(true);
    expect(matchesSearch(task({}), "task-1")).toBe(true);
  });

  it("rejects tasks that do not match", () => {
    expect(matchesSearch(task({}), "zzz")).toBe(false);
  });
});

describe("dueRank", () => {
  it("ranks overdue first, then today, then everything else", () => {
    expect(dueRank(task({ section: "OVERDUE", dueDate: "Sep 1" }))).toBe(0);
    expect(dueRank(task({ section: "TODAY", dueDate: "Today" }))).toBe(1);
    expect(dueRank(task({ section: "TODAY", dueDate: "Sep 5" }))).toBe(2);
  });
});

describe("parseDueDate", () => {
  it("parses 'Today' as today's midnight", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(parseDueDate("Today")).toBe(today.getTime());
  });

  it("parses 'MMM D' with the current year", () => {
    const year = new Date().getFullYear();
    expect(parseDueDate("Feb 2")).toBe(new Date(year, 1, 2).getTime());
  });

  it("parses 'MMM D, YYYY' and ISO strings", () => {
    expect(parseDueDate("Feb 2, 2027")).toBe(new Date(2027, 1, 2).getTime());
    expect(parseDueDate("2027-02-02")).toBe(new Date(2027, 1, 2).getTime());
  });

  it("sorts unparseable and empty dates last", () => {
    expect(parseDueDate("")).toBe(Number.MAX_SAFE_INTEGER);
    expect(parseDueDate("whenever")).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe("filterAndSortTasks", () => {
  it("returns everything with default options", () => {
    expect(filterAndSortTasks(fixtures)).toHaveLength(4);
  });

  it("filters by search across title, project and id", () => {
    const byTitle = filterAndSortTasks(fixtures, { search: "hero" });
    expect(byTitle.map((t) => t.id)).toEqual(["T1"]);

    const byId = filterAndSortTasks(fixtures, { search: "t4" });
    expect(byId.map((t) => t.id)).toEqual(["T4"]);
  });

  it("filters by section", () => {
    const overdue = filterAndSortTasks(fixtures, { section: "OVERDUE" });
    expect(overdue.map((t) => t.id)).toEqual(["T1", "T2"]);

    const today = filterAndSortTasks(fixtures, { section: "TODAY" });
    expect(today.map((t) => t.id)).toEqual(["T3", "T4"]);
  });

  it("filters by status, priority, project and tag", () => {
    expect(
      filterAndSortTasks(fixtures, { status: "Todo" }).map((t) => t.id),
    ).toEqual(["T3"]);
    expect(
      filterAndSortTasks(fixtures, { priority: "Critical" }).map((t) => t.id),
    ).toEqual(["T2"]);
    expect(
      filterAndSortTasks(fixtures, { project: "Website Redesign" }),
    ).toHaveLength(4);
    expect(
      filterAndSortTasks(fixtures, { tag: "Security" }).map((t) => t.id),
    ).toEqual(["T2"]);
  });

  it("filters by due bucket: Overdue, Today and Upcoming", () => {
    expect(filterAndSortTasks(fixtures, { due: "Overdue" }).map((t) => t.id)).toEqual(["T1", "T2"]);
    expect(filterAndSortTasks(fixtures, { due: "Today" }).map((t) => t.id)).toEqual(["T3"]);
    expect(filterAndSortTasks(fixtures, { due: "Upcoming" }).map((t) => t.id)).toEqual(["T4"]);
  });

  it("filters by assignee (exact match and Unassigned)", () => {
    const assigned = [
      task({ id: "A1", assignee: "Sarah Chen" }),
      task({ id: "A2", assignee: "Alex Morgan" }),
      task({ id: "A3" }),
    ];
    expect(
      filterAndSortTasks(assigned, { assignee: "Alex Morgan" }).map((t) => t.id),
    ).toEqual(["A2"]);
    expect(
      filterAndSortTasks(assigned, { assignee: "Unassigned" }).map((t) => t.id),
    ).toEqual(["A3"]);
    expect(filterAndSortTasks(assigned, { assignee: "All" })).toHaveLength(3);
  });

  it("matches assignee text in the search query", () => {
    const withAssignee = [
      task({ id: "A1", assignee: "Sarah Chen" }),
      task({ id: "A2" }),
    ];
    expect(
      filterAndSortTasks(withAssignee, { search: "sarah" }).map((t) => t.id),
    ).toEqual(["A1"]);
  });

  it("combines filters (search + status + tag)", () => {
    const result = filterAndSortTasks(fixtures, {
      section: "OVERDUE",
      status: "In Progress",
      tag: "Backend",
    });
    expect(result.map((t) => t.id)).toEqual(["T2"]);
  });

  it("sorts ascending: overdue first (oldest → newest), then today, then upcoming", () => {
    expect(filterAndSortTasks(fixtures).map((t) => t.id)).toEqual([
      "T1",
      "T2",
      "T3",
      "T4",
    ]);
  });

  it("sorts descending: newest due dates first, overdue last", () => {
    expect(
      filterAndSortTasks(fixtures, { direction: "desc" }).map((t) => t.id),
    ).toEqual(["T4", "T3", "T2", "T1"]);
  });

  it("sorts chronologically within a section, not alphabetically", () => {
    // "Apr 10" sorts before "Feb 2" alphabetically but AFTER it chronologically.
    const tricky = [
      task({ id: "A", dueDate: "Apr 10", section: "TODAY" }),
      task({ id: "B", dueDate: "Feb 2", section: "TODAY" }),
    ];
    expect(filterAndSortTasks(tricky).map((t) => t.id)).toEqual(["B", "A"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterAndSortTasks(fixtures, { search: "zzz" })).toEqual([]);
  });
});
