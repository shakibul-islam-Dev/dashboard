import { describe, it, expect } from "vitest";
import {
  toKanbanColumn,
  matchesKanbanSearch,
  filterKanbanTasks,
  type KanbanFilterableTask,
} from "../kanbanFilters";

const task = (over: Partial<KanbanFilterableTask>): KanbanFilterableTask => ({
  id: "K1",
  title: "Fix login bug",
  status: "Todo",
  priority: "Medium",
  assignee: "Sarah Chen",
  tags: ["Frontend"],
  ...over,
});

const fixtures: KanbanFilterableTask[] = [
  task({ id: "K1", title: "Design hero", status: "Todo", priority: "Low", assignee: "Sarah Chen", tags: ["Design"] }),
  task({ id: "K2", title: "Wire auth flow", status: "In Progress", priority: "Critical", assignee: "Alex Morgan", tags: ["Backend", "Security"] }),
  task({ id: "K3", title: "Polish dashboard", status: "Review", priority: "High", assignee: "Elena Rostova", tags: ["Frontend"] }),
  task({ id: "K4", title: "Write API docs", status: "Done", priority: "Medium", assignee: undefined, tags: ["Docs"] }),
];

describe("toKanbanColumn", () => {
  it("maps known statuses onto their columns", () => {
    expect(toKanbanColumn("Todo")).toBe("Todo");
    expect(toKanbanColumn("In Progress")).toBe("In Progress");
    expect(toKanbanColumn("Review")).toBe("Review");
    expect(toKanbanColumn("Done")).toBe("Done");
  });

  it("falls back to Todo for unknown statuses", () => {
    expect(toKanbanColumn("Archived")).toBe("Todo");
  });
});

describe("matchesKanbanSearch", () => {
  it("matches title and id case-insensitively", () => {
    expect(matchesKanbanSearch(task({}), "fix login")).toBe(true);
    expect(matchesKanbanSearch(task({}), "k1")).toBe(true);
  });

  it("matches assignee name", () => {
    expect(matchesKanbanSearch(task({ assignee: "Sarah Chen" }), "sarah")).toBe(
      true,
    );
  });

  it("returns true for an empty query", () => {
    expect(matchesKanbanSearch(task({}), "  ")).toBe(true);
  });
});

describe("filterKanbanTasks", () => {
  it("returns all tasks by default", () => {
    expect(filterKanbanTasks(fixtures)).toHaveLength(4);
  });

  it("filters by search", () => {
    expect(filterKanbanTasks(fixtures, { search: "auth" }).map((t) => t.id)).toEqual(["K2"]);
  });

  it("filters by priority", () => {
    expect(filterKanbanTasks(fixtures, { priority: "Critical" }).map((t) => t.id)).toEqual(["K2"]);
  });

  it("filters by assignee (exact and Unassigned)", () => {
    expect(
      filterKanbanTasks(fixtures, { assignee: "Alex Morgan" }).map((t) => t.id),
    ).toEqual(["K2"]);
    expect(
      filterKanbanTasks(fixtures, { assignee: "Unassigned" }).map((t) => t.id),
    ).toEqual(["K4"]);
  });

  it("filters by tag", () => {
    expect(filterKanbanTasks(fixtures, { tag: "Security" }).map((t) => t.id)).toEqual(["K2"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterKanbanTasks(fixtures, { search: "zzz" })).toEqual([]);
  });
});
