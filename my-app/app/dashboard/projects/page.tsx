"use client";

import { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
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
} from "lucide-react";
import Link from "next/link";
import { projectsPageData as projects } from "@/data/projects";
import Image from "next/image";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import CreateProjectModal from "@/components/customsUi/CreateProjectModal";

/* ------------------------------------------------------------------ */
/*  Sort helper – returns a label for each sort option                 */
/* ------------------------------------------------------------------ */
const sortLabels: Record<string, string> = {
  modified: "Last Modified",
  name: "Name",
  progress: "Progress",
};

export default function ProjectsPage() {
  /* ---- State ---- */
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"modified" | "name" | "progress">("modified");
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  1. Filter projects                                                 */
  /* ------------------------------------------------------------------ */
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "All") return matchesSearch;
      if (filter === "Active")
        return matchesSearch && project.status === "In Progress";
      if (filter === "Completed")
        return matchesSearch && project.progress === 100;
      if (filter === "Paused")
        return (
          matchesSearch &&
          (project.status === "Planning" || project.status === "Blocked")
        );
      return matchesSearch;
    })
    /* ---------------------------------------------------------------- */
    /*  1a. Sort projects                                                */
    /* ---------------------------------------------------------------- */
    .sort((a, b) => {
      if (sortOption === "name") return a.title.localeCompare(b.title);
      if (sortOption === "progress") return b.progress - a.progress;
      // "modified" – default: keep original order (already last‑modified)
      return 0;
    });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-transparent min-h-screen">
      {/* Path / Breadcrumb & Header Title */}
      <RouterNavigation />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            <PathProvider />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your team&apos;s projects.
          </p>
        </div>
        {/* --- 5. CreateProjectModal trigger --- */}
        <Button
          onClick={() => setShowCreateProject(true)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Button>
        {showCreateProject && (
          <CreateProjectModal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} />
        )}
      </div>

      {/* Toolbar: Search, Filters & View Options */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
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
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border text-xs sm:text-sm font-medium">
            {["All", "Active", "Completed", "Paused"].map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={filter === tab ? "default" : "ghost"}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side: Sorting & Layout Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* --- 1. Sort dropdown --- */}
          <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 font-medium text-foreground bg-card px-3 py-1.5 shadow-none cursor-pointer"
            >
              {sortLabels[sortOption]}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>

            {sortOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
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
                </div>
              </>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-card">
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
          </div>
        </div>
      </div>

      {/* Projects Grid / List Area */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-3"
        }
      >
        {/* --- 3. Empty state --- */}
        {filteredProjects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No projects found
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Try adjusting your search or filters.
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
          </div>
        )}

        {filteredProjects.map((project) => {
          const IconComponent = project.icon;

          /* -------------------------------------------------------------- */
          /*  2. List view – horizontal single-row layout                   */
          /* -------------------------------------------------------------- */
          if (viewMode === "list") {
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block"
              >
                <Card
                  className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden`}
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

                    {/* --- 4. MoreVertical menu (list) --- */}
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
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMenuOpenId(null);
                            }}
                          />
                          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                            {["Edit", "Archive", "Delete"].map((action) => (
                              <button
                                key={action}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMenuOpenId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          }

          /* -------------------------------------------------------------- */
          /*  Grid view – original vertical card layout                     */
          /* -------------------------------------------------------------- */
          return (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="block"
            >
              <Card
                className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden`}
              >
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${project.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {/* --- 4. MoreVertical menu (grid) --- */}
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
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMenuOpenId(null);
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                              {["Edit", "Archive", "Delete"].map((action) => (
                                <button
                                  key={action}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMenuOpenId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          </>
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
                      {project.avatars.map((imgUrl, i) => (
                        <Image
                          key={i}
                          src={imgUrl}
                          width={300}
                          height={300}
                          alt="Avatar"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-card object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
