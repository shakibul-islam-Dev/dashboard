import { describe, it, expect } from "vitest";
import {
  parseDependencyReference,
  findDependencyTask,
  isDependencyComplete,
  evaluateDependencyGate,
  type DependencyLookupTask,
} from "../dependency";

const tasks: DependencyLookupTask[] = [
  { id: "TASK-102", title: "Configure authentication", status: "Done" },
  { id: "TASK-108", title: "Set up database schema", status: "In Progress" },
  { id: "TASK-115", title: "Build report dashboard", status: "Todo" },
];

describe("parseDependencyReference", () => {
  it("trims input and returns null for empties", () => {
    expect(parseDependencyReference("  TASK-102  ")).toBe("TASK-102");
    expect(parseDependencyReference("   ")).toBeNull();
    expect(parseDependencyReference(null)).toBeNull();
    expect(parseDependencyReference(undefined)).toBeNull();
  });
});

describe("findDependencyTask", () => {
  it("resolves by exact task id", () => {
    expect(findDependencyTask("TASK-102", tasks)?.id).toBe("TASK-102");
  });

  it("resolves by exact title and is case-insensitive", () => {
    expect(findDependencyTask("CONFIGURE AUTHENTICATION", tasks)?.id).toBe(
      "TASK-102",
    );
  });

  it("falls back to substring matches for partial input", () => {
    expect(findDependencyTask("auth", tasks)?.id).toBe("TASK-102");
    expect(findDependencyTask("report", tasks)?.id).toBe("TASK-115");
  });

  it("returns undefined when nothing matches", () => {
    expect(findDependencyTask("nonexistent thing", tasks)).toBeUndefined();
  });

  it("excludes the self id to guard against self-dependency", () => {
    expect(findDependencyTask("TASK-102", tasks, "TASK-102")).toBeUndefined();
  });

  it("returns undefined for empty references", () => {
    expect(findDependencyTask("", tasks)).toBeUndefined();
    expect(findDependencyTask(null, tasks)).toBeUndefined();
  });
});

describe("isDependencyComplete", () => {
  it("is true only when the prerequisite is Done", () => {
    expect(isDependencyComplete(tasks[0])).toBe(true);
    expect(isDependencyComplete(tasks[1])).toBe(false);
    expect(isDependencyComplete(undefined)).toBe(false);
  });
});

describe("evaluateDependencyGate", () => {
  it("returns null when not moving to Done", () => {
    expect(
      evaluateDependencyGate({ dependency: "TASK-108", tasks, nextStatus: "Review" }),
    ).toBeNull();
  });

  it("returns null when there is no dependency", () => {
    expect(
      evaluateDependencyGate({ dependency: null, tasks, nextStatus: "Done" }),
    ).toBeNull();
  });

  it("returns null when the prerequisite is already Done", () => {
    expect(
      evaluateDependencyGate({ dependency: "TASK-102", tasks, nextStatus: "Done" }),
    ).toBeNull();
  });

  it("blocks with live status when the prerequisite is not Done", () => {
    const result = evaluateDependencyGate({
      dependency: "TASK-108",
      tasks,
      nextStatus: "Done",
    });
    expect(result).not.toBeNull();
    expect(result?.prerequisite.code).toBe("TASK-108");
    expect(result?.prerequisite.status).toBe("In Progress");
  });

  it("reports an unresolved dependency when the reference is not found", () => {
    const result = evaluateDependencyGate({
      dependency: "TASK-999",
      tasks,
      nextStatus: "Done",
    });
    expect(result?.prerequisite.code).toBe("TASK-999");
    expect(result?.prerequisite.status).toBe("Unresolved");
    expect(result?.prerequisite.title).toBe("Dependency not found");
  });
});
