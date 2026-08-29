"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import {
  Search,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  X,
  Archive,
  Trash2,
  Undo2,
} from "lucide-react";
import { myTasks as initialTasks, type MyTask } from "@/data/tasks";
import {
  useCustomTasks,
  customTaskToMyTask,
  useIdSet,
  updateIdSet,
  LS_ARCHIVED_TASKS_KEY,
  LS_DELETED_TASKS_KEY,
} from "@/lib/customStore";
import {
  matchesSearch,
  filterAndSortTasks,
  type DueFilter,
} from "@/lib/taskFilters";
import CreateTaskModal from "@/components/customsUi/CreateTaskModal";
import TaskDetailModal from "@/components/customsUi/TaskDetailModal";
import {
  FilterDropdown,
  TaskTable,
  StatusBadge,
} from "@/components/customsUi/MyTasksTable";
import EditTaskModal, {
  LS_EDITS_KEY,
  EDITS_EVENT,
} from "@/components/customsUi/EditTaskModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { fadeUpStagger, fadeUp, dropDown } from "@/lib/motion";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// === SECTION TYPE ===
type SectionFilter = "ALL" | "OVERDUE" | "TODAY" | "ARCHIVED";
type SortDirection = "asc" | "desc";

// === FILTER KEYS (the toolbar dropdowns) ===
type FilterKey = "Status" | "Priority" | "Project" | "Tag" | "Due Date";

// === EDITED TASK SHAPE (what EditTaskModal persists per task id) ===
interface EditedTask {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  subtasks?: unknown[];
  updatedAt?: string;
}

export default function MyTaskPage() {
  // ── Custom tasks created via the Create Task modal (localStorage-backed) ──
  const { tasks: customTasks, removeTask } = useCustomTasks();

  // ── Edits made via the Edit Task modal (localStorage-backed) ──
  const [editedTasks, setEditedTasks] = useState<Record<string, EditedTask>>({});

  const loadEdits = useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_EDITS_KEY);
      setEditedTasks(raw ? (JSON.parse(raw) as Record<string, EditedTask>) : {});
    } catch {
      setEditedTasks({});
    }
  }, []);

  // Load persisted edits on mount and sync with the Edit modal + other tabs
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must sync after mount to avoid SSR/hydration mismatch
    loadEdits();
    window.addEventListener(EDITS_EVENT, loadEdits);
    window.addEventListener("storage", loadEdits);
    return () => {
      window.removeEventListener(EDITS_EVENT, loadEdits);
      window.removeEventListener("storage", loadEdits);
    };
  }, [loadEdits]);

  // ── Merge static seed data + user-created tasks + persisted edits ──
  const tasks = useMemo<MyTask[]>(() => {
    const base = [...initialTasks, ...customTasks.map(customTaskToMyTask)];
    return base.map((t) => {
      const edit = editedTasks[t.id];
      if (!edit) return t;
      return {
        ...t,
        title: edit.title ?? t.title,
        status: edit.status ?? t.status,
        priority: edit.priority ?? t.priority,
        dueDate: edit.dueDate ?? t.dueDate,
        tags: edit.tags ?? t.tags,
      };
    });
  }, [customTasks, editedTasks]);

  // ── Lifecycle overrides: archived + deleted ids (persisted, event-synced) ──
  const archivedSet = useIdSet(LS_ARCHIVED_TASKS_KEY);
  const deletedSet = useIdSet(LS_DELETED_TASKS_KEY);

  const customIds = useMemo(
    () => new Set(customTasks.map((t) => t.id)),
    [customTasks],
  );

  const activeTasks = useMemo(
    () => tasks.filter((t) => !deletedSet.has(t.id) && !archivedSet.has(t.id)),
    [tasks, deletedSet, archivedSet],
  );

  const archivedTasks = useMemo(
    () => tasks.filter((t) => archivedSet.has(t.id) && !deletedSet.has(t.id)),
    [tasks, archivedSet, deletedSet],
  );

  // === SEARCH FUNCTIONALITY ===
  const [searchQuery, setSearchQuery] = useState("");

  // Pre-fill search from the top-nav search bar (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once on mount
      setSearchQuery(q);
    }
  }, []);

  // === SECTION FILTERING ===
  const [activeSection, setActiveSection] = useState<SectionFilter>("ALL");

  // === ATTRIBUTE FILTERS (dropdowns) ===
  const [filterMenu, setFilterMenu] = useState<FilterKey | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [dueFilter, setDueFilter] = useState<DueFilter>("All");

  const filterValues: Record<FilterKey, string> = {
    Status: statusFilter,
    Priority: priorityFilter,
    Project: projectFilter,
    Tag: tagFilter,
    "Due Date": dueFilter,
  };

  const filterOptions: Record<FilterKey, string[]> = useMemo(
    () => ({
      Status: ["All", "Todo", "In Progress", "Review", "Done"],
      Priority: ["All", "Low", "Medium", "High", "Critical"],
      Project: [
        "All",
        ...Array.from(new Set(activeTasks.map((t) => t.project))).sort(),
      ],
      Tag: ["All", ...Array.from(new Set(activeTasks.flatMap((t) => t.tags)))],
      "Due Date": ["All", "Today", "Overdue", "Upcoming"],
    }),
    [activeTasks],
  );

  const updateFilter = (key: FilterKey, value: string) => {
    switch (key) {
      case "Status":
        setStatusFilter(value);
        break;
      case "Priority":
        setPriorityFilter(value);
        break;
      case "Project":
        setProjectFilter(value);
        break;
      case "Tag":
        setTagFilter(value);
        break;
      case "Due Date":
        setDueFilter(value as DueFilter);
        break;
    }
  };

  // === CHECKBOX SELECTION ===
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // === CREATE TASK MODAL ===
  const [showCreateModal, setShowCreateModal] = useState(false);

  // === SORT TOGGLE ===
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // === TASK DETAIL MODAL ===
  const [showDetailModal, setShowDetailModal] = useState(false);

  // === EDIT TASK MODAL ===
  const [editTarget, setEditTarget] = useState<MyTask | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // === PER-ROW ACTION MENU ===
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);

  // === FILTERED AND SORTED TASKS ===
  const filteredTasks = useMemo(
    () =>
      filterAndSortTasks(activeTasks, {
        search: searchQuery,
        section: activeSection,
        status: statusFilter,
        priority: priorityFilter,
        project: projectFilter,
        tag: tagFilter,
        due: dueFilter,
        direction: sortDirection,
      }),
    [
      activeTasks,
      searchQuery,
      activeSection,
      statusFilter,
      priorityFilter,
      projectFilter,
      tagFilter,
      dueFilter,
      sortDirection,
    ],
  );

  // === DYNAMIC SECTION COUNTS (based on search, excluding section filter) ===
  const sectionCounts = useMemo(() => {
    const searched = searchQuery.trim()
      ? activeTasks.filter((t) => matchesSearch(t, searchQuery))
      : activeTasks;
    return {
      ALL: searched.length,
      OVERDUE: searched.filter((t) => t.section === "OVERDUE").length,
      TODAY: searched.filter((t) => t.section === "TODAY").length,
      ARCHIVED: archivedTasks.length,
    };
  }, [activeTasks, searchQuery, archivedTasks]);

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

  const removeFromSelection = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // === TASK CLICK HANDLER ===
  const handleTaskClick = () => {
    setShowDetailModal(true);
  };

  // === EDIT TASK HANDLER ===
  const handleEditTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditTarget(task);
    setShowEditModal(true);
  };

  // === TASK LIFECYCLE ACTIONS (archive / restore / delete) ===
  const handleArchiveTask = (id: string) => {
    updateIdSet(LS_ARCHIVED_TASKS_KEY, id, true);
    removeFromSelection(id);
    toast.success("Task archived", {
      description: "Move it back to active by restoring it from the Archived tab.",
    });
  };

  const handleRestoreTask = (id: string) => {
    updateIdSet(LS_ARCHIVED_TASKS_KEY, id, false);
    toast.success("Task restored", {
      description: "The task is back in your active list.",
    });
  };

  const handleDeleteTask = (id: string) => {
    updateIdSet(LS_ARCHIVED_TASKS_KEY, id, false);
    if (customIds.has(id)) {
      removeTask(id);
    } else {
      updateIdSet(LS_DELETED_TASKS_KEY, id, true);
    }
    removeFromSelection(id);
    toast.success("Task deleted", {
      description: "The task has been permanently removed.",
    });
  };

  const handleBulkArchive = () => {
    selectedTasks.forEach((id) =>
      updateIdSet(LS_ARCHIVED_TASKS_KEY, id, true),
    );
    const count = selectedTasks.size;
    setSelectedTasks(new Set());
    toast.success(`${count} task${count > 1 ? "s" : ""} archived`);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach((id) => {
      if (customIds.has(id)) {
        removeTask(id);
      } else {
        updateIdSet(LS_DELETED_TASKS_KEY, id, true);
      }
    });
    const count = selectedTasks.size;
    setSelectedTasks(new Set());
    toast.success(`${count} task${count > 1 ? "s" : ""} deleted`);
  };

  return (
    <PageContainer>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUpStagger}
        className="bg-transparent font-sans text-foreground"
      >
        <PageNav />

        {/* Header Section */}
      <motion.div
        variants={dropDown}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
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
      </motion.div>

      {/* Filter and Control Bar */}
      <motion.div
        variants={fadeUp}
        className="bg-card border border-border rounded-xl p-3 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3"
      >
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

          {/* Filter Dropdowns (functional) */}
          {(Object.keys(filterOptions) as FilterKey[]).map((key) => (
            <FilterDropdown
              key={key}
              label={key}
              options={filterOptions[key]}
              value={filterValues[key]}
              open={filterMenu === key}
              onOpenChange={(open) => setFilterMenu(open ? key : null)}
              onSelect={(value) => updateFilter(key, value)}
            />
          ))}
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
      </motion.div>

      {/* Clear Selection Banner */}
      <AnimatePresence>
        {selectedTasks.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="flex flex-wrap items-center gap-3 mb-4 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary font-medium"
          >
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
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-auto py-1.5"
              onClick={handleBulkArchive}
            >
              <Archive className="w-3.5 h-3.5" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-auto py-1.5 text-rose-600 hover:text-rose-600"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Section Tabs (clickable) */}
      <motion.div variants={fadeUp} className="flex items-center gap-1 mb-6 border-b border-border">
        {(["ALL", "OVERDUE", "TODAY", "ARCHIVED"] as SectionFilter[]).map(
          (section) => {
            const isActive = activeSection === section;
            const count = sectionCounts[section];

            // Only show section tabs that have tasks
            if (count === 0 && section !== "ALL") return null;

            return (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setRowMenuId(null);
                }}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase
                  transition-colors
                  ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="mt-section-underline"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
                {section === "OVERDUE" && (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                )}
                {section === "ARCHIVED" && (
                  <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                {section === "ALL" && "All Tasks"}
                {section === "OVERDUE" && "Overdue"}
                {section === "TODAY" && "Today"}
                {section === "ARCHIVED" && "Archived"}
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="px-1.5 py-0.5 text-[10px] font-semibold"
                >
                  {count}
                </Badge>
              </button>
            );
          },
        )}
      </motion.div>

      {/* Task Sections */}
      <div className="space-y-8">
        {/* ARCHIVED view */}
        {activeSection === "ARCHIVED" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Archive className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Archived
              </span>
              <Badge
                variant="secondary"
                className="px-2 py-0.5 text-xs font-semibold"
              >
                {archivedTasks.length}
              </Badge>
            </div>

            {archivedTasks.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm font-medium">No archived tasks.</p>
                <p className="text-xs mt-1">
                  Archive a task to keep it here until you restore or delete it.
                </p>
              </div>
            ) : (
              <Card className="shadow-xs overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  {archivedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-wrap items-center gap-3 px-3 py-2.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.id} · {task.project}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-auto py-1.5"
                          onClick={() => handleRestoreTask(task.id)}
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          Restore
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-auto py-1.5 text-rose-600 hover:text-rose-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* OVERDUE Section */}
        {activeSection !== "ARCHIVED" &&
          activeSection !== "TODAY" &&
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
                onEdit={handleEditTask}
                onArchive={handleArchiveTask}
                onDelete={handleDeleteTask}
                rowMenuId={rowMenuId}
                setRowMenuId={setRowMenuId}
              />
            </div>
          )}

        {/* TODAY Section */}
        {activeSection !== "ARCHIVED" &&
          activeSection !== "OVERDUE" &&
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
                onEdit={handleEditTask}
                onArchive={handleArchiveTask}
                onDelete={handleDeleteTask}
                rowMenuId={rowMenuId}
                setRowMenuId={setRowMenuId}
              />
            </div>
          )}

        {/* Empty State */}
        {activeSection !== "ARCHIVED" && filteredTasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm font-medium">No tasks match your filters.</p>
            <p className="text-xs mt-1">Try adjusting your search or section.</p>
          </div>
        )}
      </div>

      {/* Dynamic "Showing" Footer */}
      <div className="mt-6 text-xs text-muted-foreground">
        Showing {filteredTasks.length} of {activeTasks.length} active task{activeTasks.length !== 1 ? "s" : ""}
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

      {/* Edit Task Modal (remounted per task so it resets its form) */}
      <EditTaskModal
        key={editTarget?.id ?? "edit"}
        isOpen={showEditModal && !!editTarget}
        onClose={() => setShowEditModal(false)}
        task={editTarget}
      />
    </motion.div>
    </PageContainer>
  );
}