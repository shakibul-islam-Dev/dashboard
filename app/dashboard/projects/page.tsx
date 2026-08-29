"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreVertical,
  LayoutGrid,
  List,
  Calendar,
  ChevronDown,
  PencilLine,
  Archive,
  Trash2,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { projectsPageData as initialProjects } from "@/data/projects";
import {
  useCustomProjects,
  customProjectToProject,
  useIdSet,
  updateIdSet,
  useProjectEditOverrides,
  PROJECT_STYLES,
  LS_ARCHIVED_PROJECTS_KEY,
  LS_DELETED_PROJECTS_KEY,
  type ProjectEditOverride,
} from "@/lib/customStore";
import { filterAndSortProjects } from "@/lib/projectFilters";
import type { MemberAvatar } from "@/data/team";
import Image from "next/image";
import CreateProjectModal from "@/components/customsUi/CreateProjectModal";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

/* ------------------------------------------------------------------ */
/*  Sort helper – returns a label for each sort option                 */
/* ------------------------------------------------------------------ */
const sortLabels: Record<string, string> = {
  modified: "Last Modified",
  name: "Name",
  progress: "Progress",
};

const cardItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

type ProjectFilter = "All" | "Active" | "Completed" | "Paused" | "Archived";

/* Shape handed to the CreateProjectModal in edit mode */
interface EditableProjectShape {
  id: string;
  isCustom: boolean;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  teamMembers: MemberAvatar[];
}

export default function ProjectsPage() {
  /* ---- State ---- */
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"modified" | "name" | "progress">("modified");
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  /* ---- Custom projects created via the Create Project modal ---- */
  const { projects: customProjects, removeProject } = useCustomProjects();

  /* ---- Lifecycle overrides: archived + deleted ids, edited fields ---- */
  const archivedSet = useIdSet(LS_ARCHIVED_PROJECTS_KEY);
  const deletedSet = useIdSet(LS_DELETED_PROJECTS_KEY);
  const editOverrides = useProjectEditOverrides();

  /* ---- Merge static seed data + user-created projects + persisted edits ---- */
  const projects = useMemo(() => {
    const base = [
      ...initialProjects,
      ...customProjects.map(customProjectToProject),
    ];
    return base.map((project) => {
      const override: ProjectEditOverride | undefined = editOverrides[project.id];
      if (!override) return project;

      const status = override.status ?? project.status;
      const styles =
        PROJECT_STYLES[status] ??
        PROJECT_STYLES[project.status] ??
        PROJECT_STYLES["In Progress"];

      return {
        ...project,
        title: override.title ?? project.title,
        description: override.description ?? project.description,
        status,
        statusColor: styles.statusColor,
        borderColor: styles.borderColor,
        progressColor: styles.progressColor,
      };
    });
  }, [customProjects, editOverrides]);

  /* ---- Active vs archived sets ---- */
  const nonArchivedProjects = useMemo(
    () =>
      projects.filter(
        (p) => !archivedSet.has(p.id) && !deletedSet.has(p.id),
      ),
    [projects, archivedSet, deletedSet],
  );

  const archivedProjects = useMemo(
    () =>
      projects.filter((p) => archivedSet.has(p.id) && !deletedSet.has(p.id)),
    [projects, archivedSet, deletedSet],
  );

  /* ------------------------------------------------------------------ */
  /*  1. Filter projects                                                 */
  /* ------------------------------------------------------------------ */
  const filteredProjects = useMemo(() => {
    const source = filter === "Archived" ? archivedProjects : nonArchivedProjects;
    return filterAndSortProjects(source, filter, searchTerm, sortOption);
  }, [filter, archivedProjects, nonArchivedProjects, searchTerm, sortOption]);

  /* ---- Shape passed to the modal when editing a project ---- */
  const editableProject = useMemo<EditableProjectShape | null>(() => {
    if (!editProjectId) return null;

    const custom = customProjects.find((p) => p.id === editProjectId);
    const base = projects.find((p) => p.id === editProjectId);
    if (!base) return null;

    if (custom) {
      return {
        id: custom.id,
        isCustom: true,
        name: custom.name,
        description: custom.description,
        status: custom.status,
        startDate: custom.startDate,
        endDate: custom.endDate,
        teamMembers: custom.teamMembers,
      };
    }

    return {
      id: base.id,
      isCustom: false,
      name: base.title,
      description: base.description,
      status: base.status,
      startDate: "",
      endDate: "",
      teamMembers: [],
    };
  }, [editProjectId, customProjects, projects]);

  /* ------------------------------------------------------------------ */
  /*  2. Project actions (Edit / Archive / Restore / Delete)             */
  /* ------------------------------------------------------------------ */
  const isCustomProject = (id: string) =>
    customProjects.some((p) => p.id === id);

  const handleMenuAction = (action: string, id: string) => {
    if (action === "Edit") {
      setEditProjectId(id);
      setShowCreateProject(true);
    } else if (action === "Archive") {
      updateIdSet(LS_ARCHIVED_PROJECTS_KEY, id, true);
      toast.success("Project archived", {
        description: "Restore it anytime from the Archived filter.",
      });
    } else if (action === "Delete") {
      if (isCustomProject(id)) {
        removeProject(id);
      } else {
        updateIdSet(LS_DELETED_PROJECTS_KEY, id, true);
      }
      updateIdSet(LS_ARCHIVED_PROJECTS_KEY, id, false);
      toast.success("Project deleted", {
        description: "The project has been permanently removed.",
      });
    }
    setMenuOpenId(null);
  };

  const handleRestore = (id: string) => {
    updateIdSet(LS_ARCHIVED_PROJECTS_KEY, id, false);
    toast.success("Project restored", {
      description: "The project is back in the active list.",
    });
  };

  const handleArchiveDelete = (id: string) => {
    if (isCustomProject(id)) {
      removeProject(id);
    } else {
      updateIdSet(LS_DELETED_PROJECTS_KEY, id, true);
    }
    updateIdSet(LS_ARCHIVED_PROJECTS_KEY, id, false);
    toast.success("Project deleted", {
      description: "The project has been permanently removed.",
    });
  };

  return (
    <PageContainer>
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="bg-transparent font-sans text-foreground space-y-6"
    >
      {/* Path / Breadcrumb & Header Title */}
      <PageNav />
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your team&apos;s projects.
          </p>
        </div>
        {/* --- New Project trigger --- */}
        <Button
          onClick={() => {
            setEditProjectId(null);
            setShowCreateProject(true);
          }}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Button>
      </motion.div>

      {/* Create / Edit Project Modal (always mounted so exit animations play) */}
      <CreateProjectModal
        key={editableProject?.id ?? "new"}
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        editableProject={editableProject}
      />

      {/* Toolbar: Search, Filters & View Options */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 24 }}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2"
      >
        {/* Left Side: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-60 bg-card border-border focus-visible:ring-ring shadow-none text-sm"
            />
          </div>

          {/* Filter Segmented Control */}
          <div className="relative flex items-center bg-muted/60 p-1 rounded-lg border border-border text-xs sm:text-sm font-medium">
            {(["All", "Active", "Completed", "Paused", "Archived"] as ProjectFilter[]).map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={filter === tab ? "default" : "ghost"}
                onClick={() => setFilter(tab)}
                className={`relative px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  filter === tab
                    ? "font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === tab && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    className="absolute inset-0 rounded-md bg-primary shadow-sm border border-primary/40"
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side: Sorting & Layout Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* --- Sort dropdown --- */}
          <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 font-medium text-foreground bg-card px-3 py-1.5 shadow-none cursor-pointer"
            >
              {sortLabels[sortOption]}
              <motion.span
                animate={{ rotate: sortOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.span>
            </Button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSortOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px] origin-top-right"
                  >
                    {(["modified", "name", "progress"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortOption(opt);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer ${
                          sortOption === opt
                            ? "font-semibold text-foreground bg-muted/50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {sortLabels[opt]}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* View mode toggle */}
          <motion.div
            layout
            className="flex items-center border border-border rounded-lg p-0.5 bg-card"
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "grid"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Projects Grid / List Area */}
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-3"
        }
      >
        {/* --- Empty state --- */}
        {filteredProjects.length === 0 && (
          <motion.div
            variants={cardItem}
            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
          >
            <Search className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {filter === "Archived" ? "No archived projects" : "No projects found"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {filter === "Archived"
                ? "Archive a project to keep it here until you restore or delete it."
                : "Try adjusting your search or filters."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilter("All");
              }}
              className="cursor-pointer"
            >
              Clear filters
            </Button>
          </motion.div>
        )}

        {filteredProjects.map((project) => {
          const IconComponent = project.icon;

          /* -------------------------------------------------------------- */
          /*  Archived view – restore/delete rows, no link to detail page   */
          /* -------------------------------------------------------------- */
          if (filter === "Archived") {
            return (
              <motion.div
                key={project.id}
                layout
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <Card
                className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden h-full`}
              >
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${project.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium px-2 py-0.5 shadow-none border-none ${project.statusColor}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mt-3.5 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 flex-1 cursor-pointer"
                      onClick={() => handleRestore(project.id)}
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 flex-1 text-rose-600 hover:text-rose-600 cursor-pointer"
                      onClick={() => handleArchiveDelete(project.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            );
          }

          /* -------------------------------------------------------------- */
          /*  List view – horizontal single-row layout                      */
          /* -------------------------------------------------------------- */
          if (viewMode === "list") {
            return (
              <motion.div
                key={project.id}
                layout
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block h-full"
              >
                <Card
                  className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden h-full`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`p-2.5 rounded-lg shrink-0 ${project.iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Title & description (truncated) */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium px-2 py-0.5 shadow-none border-none shrink-0 ${project.statusColor}`}
                    >
                      {project.status}
                    </Badge>

                    {/* Progress bar */}
                    <div className="w-28 shrink-0 hidden sm:block">
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <Progress
                        value={project.progress}
                        className="h-1.5 bg-muted"
                      />
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.date}</span>
                    </div>

                    {/* MoreVertical menu (list) */}
                    <div className="relative shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === project.id ? null : project.id
                          );
                        }}
                        className="text-muted-foreground hover:text-muted-foreground p-1 rounded-md cursor-pointer transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {menuOpenId === project.id && (
                        <ProjectActionMenu
                          onAction={(action) =>
                            handleMenuAction(action, project.id)
                          }
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            );
          }

          /* -------------------------------------------------------------- */
          /*  Grid view – original vertical card layout                     */
          /* -------------------------------------------------------------- */
          return (
            <motion.div
              key={project.id}
              layout
              variants={cardItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block h-full"
              >
                <Card
                  className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden h-full`}
                >
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${project.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {/* MoreVertical menu (grid) */}
                      <div className="relative">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMenuOpenId(
                              menuOpenId === project.id ? null : project.id
                            );
                          }}
                          className="text-muted-foreground hover:text-muted-foreground p-1 rounded-md cursor-pointer transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {menuOpenId === project.id && (
                          <ProjectActionMenu
                            onAction={(action) =>
                              handleMenuAction(action, project.id)
                            }
                          />
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-foreground mt-3.5 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium px-2 py-0.5 shadow-none border-none ${project.statusColor}`}
                    >
                      {project.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-foreground font-semibold">
                        {project.progress}%
                      </span>
                      <span className="text-muted-foreground">
                        {project.completedTasks}/{project.totalTasks} Tasks
                      </span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-1.5 bg-muted"
                    />
                  </div>

                  {/* Card Footer: Assignee Avatars */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.avatars.map((av, i) =>
                        av.startsWith("http") ? (
                          <Image
                            key={i}
                            src={av}
                            width={300}
                            height={300}
                            alt="Avatar"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-card object-cover"
                          />
                        ) : (
                          <div
                            key={i}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-[9px] font-bold ring-2 ring-card"
                          >
                            {av}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
              </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
    </PageContainer>
  );
}

/* === PROJECT ACTION MENU (Edit / Archive / Delete) === */
function ProjectActionMenu({ onAction }: { onAction: (action: string) => void }) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAction("");
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px] origin-top-right"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction("Edit");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-muted transition-colors cursor-pointer"
        >
          <PencilLine className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction("Archive");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5" />
          Archive
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction("Delete");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-muted transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </motion.div>
    </>
  );
}