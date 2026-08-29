import { describe, it, expect } from "vitest";
import {
  filterAndSortProjects,
  sortBoardProjects,
} from "../projectFilters";

type P = {
  title: string;
  description: string;
  status: string;
  progress: number;
};

const projects: P[] = [
  { title: "Website Redesign", description: "Marketing site rebuild", status: "In Progress", progress: 72 },
  { title: "Auth System", description: "SSO and RBAC", status: "Review", progress: 84 },
  { title: "API Platform", description: "GraphQL gateway", status: "Planning", progress: 41 },
  { title: "Payments", description: "Stripe payouts", status: "Blocked", progress: 30 },
  { title: "Legacy Portal", description: "Old admin", status: "On Hold", progress: 10 },
  { title: "Old Campaign", description: "Finished effort", status: "Completed", progress: 100 },
  { title: "Perf Tuning", description: "Speed pass done", status: "In Progress", progress: 100 },
];

describe("filterAndSortProjects", () => {
  it("returns everything on the All tab without search", () => {
    expect(filterAndSortProjects(projects, "All", "", "modified")).toHaveLength(7);
  });

  it("Active includes In Progress and Review", () => {
    const titles = filterAndSortProjects(projects, "Active", "", "modified").map((p) => p.title);
    expect(titles).toEqual(["Website Redesign", "Auth System", "Perf Tuning"]);
  });

  it("Completed matches status Completed or 100% progress", () => {
    const titles = filterAndSortProjects(projects, "Completed", "", "modified").map((p) => p.title);
    expect(titles).toEqual(["Old Campaign", "Perf Tuning"]);
  });

  it("Paused includes Planning, On Hold and Blocked", () => {
    const titles = filterAndSortProjects(projects, "Paused", "", "modified").map((p) => p.title);
    expect(titles).toEqual(["API Platform", "Payments", "Legacy Portal"]);
  });

  it("searches title and description case-insensitively", () => {
    expect(
      filterAndSortProjects(projects, "All", "stripe", "modified").map((p) => p.title),
    ).toEqual(["Payments"]);
    expect(
      filterAndSortProjects(projects, "All", "REBUILD", "modified").map((p) => p.title),
    ).toEqual(["Website Redesign"]);
  });

  it("combines tab filter with search", () => {
    const result = filterAndSortProjects(projects, "Active", "auth", "modified");
    expect(result.map((p) => p.title)).toEqual(["Auth System"]);
  });

  it("sorts by name alphabetically", () => {
    const titles = filterAndSortProjects(projects, "All", "", "name").map((p) => p.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
    expect(titles[0]).toBe("API Platform");
  });

  it("sorts by progress descending", () => {
    const progressList = filterAndSortProjects(projects, "All", "", "progress").map((p) => p.progress);
    expect(progressList).toEqual([...progressList].sort((a, b) => b - a));
  });
});

describe("sortBoardProjects", () => {
  const board = [
    { title: "Low", priority: "Normal", dueDate: "Aug 15" },
    { title: "Urgent", priority: "Urgent", dueDate: "Sep 30" },
    { title: "Mid", priority: "Medium", dueDate: "Feb 2" },
    { title: "High", priority: "High", dueDate: "Apr 10" },
  ];

  it("returns the list untouched when sortBy is null", () => {
    expect(sortBoardProjects(board, null)).toBe(board);
  });

  it("sorts by priority Urgent → High → Medium → Normal", () => {
    const titles = sortBoardProjects(board, "priority").map((p) => p.title);
    expect(titles).toEqual(["Urgent", "High", "Mid", "Low"]);
  });

  it("sorts unknown priorities last", () => {
    const withUnknown = [...board, { title: "??", priority: "Weird", dueDate: "Aug 1" }];
    expect(sortBoardProjects(withUnknown, "priority").at(-1)?.title).toBe("??");
  });

  it("sorts by due date chronologically, not alphabetically", () => {
    // Alphabetically "Apr 10" < "Feb 2", but chronologically Feb 2 comes first.
    const titles = sortBoardProjects(board, "dueDate").map((p) => p.title);
    expect(titles).toEqual(["Mid", "High", "Low", "Urgent"]);
  });
});
