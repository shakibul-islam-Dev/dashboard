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

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // ফিল্টার লজিক
  const filteredProjects = projects.filter((project) => {
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
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-transparent min-h-screen">
      {/* Path / Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            <PathProvider />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your team&apos;s projects.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Button>
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
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Sorting & Layout Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <button className="flex items-center gap-1.5 font-medium text-foreground bg-card border border-border px-3 py-1.5 rounded-lg shadow-none hover:bg-muted cursor-pointer">
              Last Modified{" "}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center border border-border rounded-lg p-0.5 bg-card">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "grid"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / List Area */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-4"
        }
      >
        {filteredProjects.map((project) => {
          const IconComponent = project.icon;

          return (
            <Card
              key={project.id}
              className={`bg-card border-border shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden`}
            >
              {/* Dynamic Link wrapper for each project */}
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="block h-full"
              >
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  {/* Card Top Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-lg ${project.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="text-muted-foreground hover:text-muted-foreground p-1 rounded-md cursor-pointer transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
                          alt="Avatar"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-card object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
