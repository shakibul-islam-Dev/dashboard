import { describe, it, expect } from "vitest";
import { filterTeamMembers } from "../teamFilters";

type M = { name: string; email: string; role: string; status: string };

const members: M[] = [
  { name: "Alex Morgan", email: "alex@taskboard.app", role: "Lead Developer", status: "Online" },
  { name: "Sarah Chen", email: "sarah@taskboard.app", role: "Senior Designer", status: "Busy" },
  { name: "John Carter", email: "john@taskboard.app", role: "Product Manager", status: "Offline" },
  { name: "Maya Patel", email: "maya@taskboard.app", role: "Backend Engineer", status: "Online" },
];

describe("filterTeamMembers", () => {
  it("returns everyone with no search and status All", () => {
    expect(filterTeamMembers(members, "", "All")).toHaveLength(4);
  });

  it("searches name, email and role case-insensitively", () => {
    expect(filterTeamMembers(members, "alex", "All").map((m) => m.name)).toEqual(["Alex Morgan"]);
    expect(filterTeamMembers(members, "TASKBOARD", "All")).toHaveLength(4);
    expect(filterTeamMembers(members, "designer", "All").map((m) => m.name)).toEqual(["Sarah Chen"]);
  });

  it("filters by status", () => {
    expect(filterTeamMembers(members, "", "Online").map((m) => m.name)).toEqual([
      "Alex Morgan",
      "Maya Patel",
    ]);
    expect(filterTeamMembers(members, "", "Busy")).toHaveLength(1);
  });

  it("combines search with the status filter", () => {
    const result = filterTeamMembers(members, "maya", "Online");
    expect(result.map((m) => m.name)).toEqual(["Maya Patel"]);

    const none = filterTeamMembers(members, "maya", "Busy");
    expect(none).toEqual([]);
  });

  it("trims the search query", () => {
    expect(filterTeamMembers(members, "  alex  ", "All")).toHaveLength(1);
  });
});
