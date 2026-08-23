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
  Globe,
  Smartphone,
  ShieldCheck,
  Cpu,
  Layout,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    {
      id: "website-redesign",
      title: "Website Redesign",
      description: "Marketing site overhaul with new brand guidelines.",
      status: "In Progress",
      statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      borderColor: "border-l-blue-500",
      progressColor: "bg-blue-600",
      date: "Oct 12",
      progress: 72,
      completedTasks: 18,
      totalTasks: 25,
      icon: Globe,
      iconBg: "bg-blue-50 text-blue-600",
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "mobile-app-mvp",
      title: "Mobile App MVP",
      description: "React Native application for core user flows.",
      status: "In Progress",
      statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      borderColor: "border-l-blue-500",
      progressColor: "bg-blue-600",
      date: "Nov 30",
      progress: 58,
      completedTasks: 12,
      totalTasks: 21,
      icon: Smartphone,
      iconBg: "bg-orange-50 text-orange-600",
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "auth-system",
      title: "Authentication System",
      description: "SSO implementation and RBAC role definitions.",
      status: "Review",
      statusColor: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      borderColor: "border-l-amber-500",
      progressColor: "bg-amber-500",
      date: "Sep 15",
      progress: 84,
      completedTasks: 21,
      totalTasks: 25,
      icon: ShieldCheck,
      iconBg: "bg-amber-50 text-amber-600",
      avatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "api-platform",
      title: "API Platform",
      description: "GraphQL migration and rate limiting setup.",
      status: "Planning",
      statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      borderColor: "border-l-gray-500",
      progressColor: "bg-gray-600",
      date: "Dec 01",
      progress: 41,
      completedTasks: 9,
      totalTasks: 22,
      icon: Cpu,
      iconBg: "bg-purple-50 text-purple-600",
      avatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "dashboard-redesign",
      title: "Dashboard Redesign",
      description: "New analytics and reporting interface.",
      status: "In Progress",
      statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      borderColor: "border-l-blue-500",
      progressColor: "bg-blue-600",
      date: "Jan 15",
      progress: 15,
      completedTasks: 3,
      totalTasks: 20,
      icon: Layout,
      iconBg: "bg-emerald-50 text-emerald-600",
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      id: "payment-integration",
      title: "Payment Integration",
      description: "Stripe Connect implementation for marketplace.",
      status: "Blocked",
      statusColor: "bg-rose-50 text-rose-700 hover:bg-rose-100",
      borderColor: "border-l-rose-500",
      progressColor: "bg-rose-500",
      date: "Oct 25",
      progress: 30,
      completedTasks: 6,
      totalTasks: 20,
      icon: CreditCard,
      iconBg: "bg-rose-50 text-rose-600",
      avatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      ],
    },
  ];

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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* Path / Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            <PathProvider />
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all your team&apos;s projects.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Button>
      </div>

      {/* Toolbar: Search, Filters & View Options */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Left Side: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-60 bg-white border-gray-200 focus-visible:ring-blue-500 shadow-none text-sm"
            />
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center bg-gray-200/60 p-1 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium">
            {["All", "Active", "Completed", "Paused"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-white text-gray-900 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Sorting & Layout Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <button className="flex items-center gap-1.5 font-medium text-gray-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-none hover:bg-gray-50 cursor-pointer">
              Last Modified{" "}
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded cursor-pointer transition-all ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
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
              className={`bg-white border-gray-200 shadow-sm border-l-4 ${project.borderColor} transition-all hover:shadow-md relative overflow-hidden`}
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
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mt-3.5 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
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
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-gray-900 font-semibold">
                        {project.progress}%
                      </span>
                      <span className="text-gray-400">
                        {project.completedTasks}/{project.totalTasks} Tasks
                      </span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-1.5 bg-gray-100"
                    />
                  </div>

                  {/* Card Footer: Assignee Avatars */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.avatars.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="Avatar"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
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
