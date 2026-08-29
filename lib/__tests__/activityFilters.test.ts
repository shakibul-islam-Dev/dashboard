import { describe, it, expect } from "vitest";
import {
  filterActivityGroups,
  activityTabType,
  type ActivityItemType,
} from "../activityFilters";

type Item = { type: ActivityItemType };
type Group = { section: string; items: Item[] };

const groups: Group[] = [
  {
    section: "TODAY",
    items: [
      { type: "task" },
      { type: "project" },
      { type: "comment" },
    ],
  },
  {
    section: "YESTERDAY",
    items: [
      { type: "team" },
      { type: "task" },
    ],
  },
  {
    section: "EARLIER",
    items: [{ type: "comment" }],
  },
];

describe("activityTabType", () => {
  it("maps tabs to item types", () => {
    expect(activityTabType("Tasks")).toBe("task");
    expect(activityTabType("Projects")).toBe("project");
    expect(activityTabType("Team")).toBe("team");
    expect(activityTabType("Comments")).toBe("comment");
  });

  it("returns null for All Activity and unknown tabs", () => {
    expect(activityTabType("All Activity")).toBeNull();
    expect(activityTabType("Whatever")).toBeNull();
  });
});

describe("filterActivityGroups", () => {
  it("returns the groups untouched for All Activity", () => {
    expect(filterActivityGroups(groups, "All Activity")).toBe(groups);
  });

  it("keeps only matching items and drops empty groups", () => {
    const result = filterActivityGroups(groups, "Tasks");
    expect(result).toHaveLength(2);
    expect(result[0].section).toBe("TODAY");
    expect(result[0].items).toEqual([{ type: "task" }]);
    expect(result[1].section).toBe("YESTERDAY");
  });

  it("returns an empty array when no group has matching items", () => {
    const teamOnly: Group[] = [
      { section: "TODAY", items: [{ type: "task" }] },
    ];
    expect(filterActivityGroups(teamOnly, "Comments")).toEqual([]);
  });

  it("does not mutate the input groups", () => {
    filterActivityGroups(groups, "Tasks");
    expect(groups[0].items).toHaveLength(3);
  });
});
