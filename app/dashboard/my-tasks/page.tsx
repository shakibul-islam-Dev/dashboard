"use client";

import React, { useState, useMemo } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Search,
  Plus,
  AlertTriangle,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  ChevronUp,
  Minus,
  X,
} from "lucide-react";
import { myTasks as initialTasks, type MyTask } from "@/data/tasks";
import {
  useCustomTasks,
  customTaskToMyTask,
} from "@/lib/customStore";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import CreateTaskModal from "@/components/customsUi/CreateTaskModal";
import TaskDetailModal from "@/components/customsUi/TaskDetailModal";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// === SECTION TYPE ===
type SectionFilter = "ALL" | "OVERDUE" | "TODAY";
type SortDirection = "asc" | "desc";

export default function MyTaskPage() {
  // ── Custom tasks created via the Create Task modal (localStorage-backed) ──
  const { tasks: customTasks } = useCustomTasks();

  // ── Merge static seed data with user-created tasks ──
  const tasks = useMemo<MyTask[]>(
    () => [...initialTasks, ...customTasks.map(customTaskToMyTask)],
    [customTasks],
  );

  // === SEARCH FUNCTIONALITY ===
  const [searchQuery, setSearchQuery] = useState("");

  // === SECTION FILTERING ===
  const [activeSection, setActiveSection] = useState<SectionFilter>("ALL");

  // === CHECKBOX SELECTION ===
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // === CREATE TASK MODAL ===
  const [showCreateModal, setShowCreateModal] = useState(false);

  // === SORT TOGGLE ===
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // === TASK DETAIL MODAL ===
  const [showDetailModal, setShowDetailModal] = useState(false);

  // === FILTERED AND SORTED TASKS ===
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search filter: match against title or project name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.project.toLowerCase().includes(query)
      );
    }

    // Section filter: only show tasks from the active section
    if (activeSection !== "ALL") {
      result = result.filter((t) => t.section === activeSection);
    }

    // Sort by due date (ascending or descending)
    result = [...result].sort((a, b) => {
      // "Today" comes before dated items; overdue dates are treated as earlier
      const order = (s: MyTask) => {
        if (s.dueDate === "Today") return 1;
        if (s.section === "OVERDUE") return 0;
        return 2;
      };
      const aOrder = order(a);
      const bOrder = order(b);
      if (aOrder !== bOrder) return aOrder - bOrder;
      const cmp = a.dueDate.localeCompare(b.dueDate);
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [tasks, searchQuery, activeSection, sortDirection]);

  // === DYNAMIC SECTION COUNTS (based on search, excluding section filter) ===
  const sectionCounts = useMemo(() => {
    let searched = tasks;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      searched = searched.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.project.toLowerCase().includes(query)
      );
    }
    return {
      ALL: searched.length,
      OVERDUE: searched.filter((t) => t.section === "OVERDUE").length,
      TODAY: searched.filter((t) => t.section === "TODAY").length,
    };
  }, [tasks, searchQuery]);

  // === CHECKBOX HANDLERS ===
  const allVisibleIds = filteredTasks.map((t) => t.id);
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedTasks.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(allVisibleIds));
    }
  };

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // === TASK CLICK HANDLER ===
  const handleTaskClick = () => {
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 font-sans text-foreground">
      <PathProvider />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks assigned to you across all projects.
          </p>
        </div>
        <Button
          className="gap-2 self-start sm:self-auto shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-card border border-border rounded-xl p-3 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative min-w-50 flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter tasks..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdown Buttons (visual only for now) */}
          {["Status", "Priority", "Project", "Tag", "Due Date"].map(
            (filter) => (
              <Button
                key={filter}
                variant="outline"
                className="gap-1.5"
              >
                {filter}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            ),
          )}
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
          <span>Sort by:</span>
          <Button
            variant="ghost"
            className="gap-1.5 font-medium h-auto p-0 hover:bg-transparent"
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            Due Date ({sortDirection === "asc" ? "Asc" : "Desc"})
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Clear Selection Banner */}
      {selectedTasks.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary font-medium">
          <span>{selectedTasks.size} task{selectedTasks.size > 1 ? "s" : ""} selected</span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-auto p-0 text-primary hover:text-primary"
            onClick={() => setSelectedTasks(new Set())}
          >
            <X className="w-3.5 h-3.5" />
            Clear selection
          </Button>
        </div>
      )}

      {/* Section Tabs (clickable) */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {(["ALL", "OVERDUE", "TODAY"] as SectionFilter[]).map((section) => {
          const isActive = activeSection === section;
          const count = sectionCounts[section];

          // Only show section tabs that have tasks
          if (count === 0 && section !== "ALL") return null;

          return (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase
                border-b-2 transition-colors
                ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {section === "OVERDUE" && (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              )}
              {section === "ALL" && "All Tasks"}
              {section === "OVERDUE" && "Overdue"}
              {section === "TODAY" && "Today"}
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="px-1.5 py-0.5 text-[10px] font-semibold"
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Task Sections */}
      <div className="space-y-8">
        {/* OVERDUE Section */}
        {activeSection !== "TODAY" &&
          filteredTasks.filter((t) => t.section === "OVERDUE").length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold tracking-wider text-rose-500 uppercase">
                  Overdue
                </span>
                <Badge variant="destructive" className="px-2 py-0.5 text-xs font-semibold">
                  {filteredTasks.filter((t) => t.section === "OVERDUE").length}
                </Badge>
              </div>
              <TaskTable
                tasks={filteredTasks.filter((t) => t.section === "OVERDUE")}
                showHeader={true}
                selectedTasks={selectedTasks}
                toggleSelectAll={toggleSelectAll}
                toggleTaskSelection={toggleTaskSelection}
                allSelected={allSelected}
                onTaskClick={handleTaskClick}
              />
            </div>
          )}

        {/* TODAY Section */}
        {activeSection !== "OVERDUE" &&
          filteredTasks.filter((t) => t.section === "TODAY").length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                  Today
                </span>
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                  {filteredTasks.filter((t) => t.section === "TODAY").length}
                </Badge>
              </div>
              <TaskTable
                tasks={filteredTasks.filter((t) => t.section === "TODAY")}
                showHeader={activeSection === "ALL"}
                selectedTasks={selectedTasks}
                toggleSelectAll={toggleSelectAll}
                toggleTaskSelection={toggleTaskSelection}
                allSelected={allSelected}
                onTaskClick={handleTaskClick}
              />
            </div>
          )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm font-medium">No tasks match your filters.</p>
            <p className="text-xs mt-1">Try adjusting your search or section.</p>
          </div>
        )}
      </div>

      {/* Dynamic "Showing" Footer */}
      <div className="mt-6 text-xs text-muted-foreground">
        Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}

// === TASK TABLE COMPONENT ===
function TaskTable({
  tasks,
  showHeader = false,
  selectedTasks,
  toggleSelectAll,
  toggleTaskSelection,
  allSelected,
  onTaskClick,
}: {
  tasks: MyTask[];
  showHeader?: boolean;
  selectedTasks: Set<string>;
  toggleSelectAll: () => void;
  toggleTaskSelection: (id: string) => void;
  allSelected: boolean;
  onTaskClick: (id: string) => void;
}) {
  return (
    <Card className="shadow-xs overflow-hidden">
      <RouterNavigation />
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-175">
          {showHeader && (
            <TableHeader>
              <TableRow className="bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                <TableHead className="p-3.5 pl-4 w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="p-3.5">Task</TableHead>
                <TableHead className="p-3.5">Project</TableHead>
                <TableHead className="p-3.5">Status</TableHead>
                <TableHead className="p-3.5">Priority</TableHead>
                <TableHead className="p-3.5">Due Date</TableHead>
                <TableHead className="p-3.5 pr-4">Tags</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-muted/60 transition-colors cursor-pointer"
                onClick={() => onTaskClick(task.id)}
              >
                <TableCell
                  className="p-3.5 pl-4 align-top"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    className="mt-0.5 cursor-pointer"
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                  />
                </TableCell>
                <TableCell className="p-3.5 align-top max-w-xs">
                  <p className="font-medium text-foreground leading-snug">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.id}
                  </p>
                </TableCell>
                <TableCell className="p-3.5 align-top text-muted-foreground font-normal">
                  {task.project}
                </TableCell>
                <TableCell className="p-3.5 align-top">
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell className="p-3.5 align-top">
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell className="p-3.5 align-top">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span
                      className={
                        task.section === "OVERDUE"
                          ? "text-rose-600 font-semibold"
                          : "text-foreground"
                      }
                    >
                      {task.dueDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="p-3.5 pr-4 align-top">
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[11px] font-medium px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// === BADGE HELPERS ===
const STATUS_BADGE_STYLES: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10",
  Review: "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/10 dark:text-amber-400",
  Done: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/10 dark:text-emerald-400",
};

const STATUS_DOT_STYLES: Record<string, string> = {
  "In Progress": "bg-primary",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
};

function StatusBadge({ status }: { status: string }) {
  const hasStyle = Boolean(STATUS_BADGE_STYLES[status]);
  return (
    <Badge
      variant={hasStyle ? "default" : "secondary"}
      className={`gap-1.5 ${STATUS_BADGE_STYLES[status] ?? "hover:bg-secondary"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_STYLES[status] ?? "bg-muted-foreground"}`}
      ></span>
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
          <ChevronUp className="w-3.5 h-3.5" />
          Critical
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
          <ChevronUp className="w-3.5 h-3.5" />
          High
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ChevronDown className="w-3.5 h-3.5" />
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Minus className="w-3.5 h-3.5" />
          Medium
        </span>
      );
  }
}
