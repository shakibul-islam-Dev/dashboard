"use client";

import {
  Folder,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PathProvider from "@/components/customsUi/PathProvider";
import Link from "next/link";

export default function DashboardHome() {
  const projects = [
    {
      id: "website-redesign", // Added unique ID
      title: "Website Redesign",
      tag: "Q3",
      borderColor: "border-l-blue-500",
      description: "Marketing site overhaul with new brand guidelines.",
      progress: 72,
      avatars: ["E", "M", "+2"],
      date: "Oct 12",
    },
    {
      id: "mobile-app-mvp", // Added unique ID
      title: "Mobile App MVP",
      tag: "Q4",
      borderColor: "border-l-amber-500",
      description: "React Native application for core user flows.",
      progress: 58,
      avatars: ["A", "B"],
      date: "Nov 30",
    },
    {
      id: "auth-system", // Added unique ID
      title: "Auth System",
      tag: "Core",
      borderColor: "border-l-emerald-500",
      description: "SSO implementation and RBAC role definitions.",
      progress: 84,
      avatars: ["D"],
      date: "Sep 15",
    },
    {
      id: "api-platform", // Added unique ID
      title: "API Platform",
      tag: "Infra",
      borderColor: "border-l-indigo-300",
      description: "GraphQL migration and rate limiting setup.",
      progress: 41,
      avatars: ["S", "T"],
      date: "Dec 01",
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 w-full max-w-7xl mx-auto">
      {/* Top Header Section */}
      <PathProvider />
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Overview of your projects, tasks and team activity.
            </p>
          </div>
          <Link href={`/dashboard/projects`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer w-full sm:w-fit shadow-sm">
              <Zap className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Active Projects
              </span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Folder className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                12
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                ↑2
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Total Tasks
              </span>
              <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                <ListTodo className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                128
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Completed Tasks
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                84
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                This week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                Overdue Tasks
              </span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-rose-600">
                7
              </span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                ↑3
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Project Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Project Progress */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Project Progress
            </h2>
            <Button
              variant="link"
              className="text-blue-600 p-0 h-auto font-medium text-sm"
              // asChild
            >
              <Link href="/dashboard/projects">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <Card
                key={proj.id}
                className={`border-gray-100 cursor-pointer shadow-sm border-l-4 ${proj.borderColor} hover:shadow-md transition-shadow`}
              >
                {/* Dynamic Link Route */}
                <Link href={`/dashboard/projects`} className="block h-full">
                  <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900">
                          {proj.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 font-medium text-xs"
                        >
                          {proj.tag}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span className="font-medium text-gray-700">
                          {proj.progress}%
                        </span>
                      </div>
                      <Progress value={proj.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {proj.avatars.map((av, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] font-semibold border-2 border-white"
                          >
                            {av}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{proj.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Recent Activity */}
        <Card className="border-gray-100 shadow-sm flex flex-col justify-between">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>

              <div className="relative pl-4 space-y-6 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <div className="relative text-xs sm:text-sm">
                  <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></span>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      Sarah Jenkins
                    </span>{" "}
                    pushed 3 commits to{" "}
                    <code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-[11px] font-mono">
                      feature/auth
                    </code>
                  </p>
                  <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 block">
                    10 minutes ago
                  </span>
                </div>

                <div className="relative text-xs sm:text-sm">
                  <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      Mike Chen
                    </span>{" "}
                    completed task{" "}
                    <span className="font-semibold text-blue-600 cursor-pointer">
                      Update API Docs
                    </span>
                  </p>
                  <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 block">
                    1 hour ago
                  </span>
                </div>

                <div className="relative text-xs sm:text-sm">
                  <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></span>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      Elena Rostova
                    </span>{" "}
                    created a new pull request{" "}
                    <span className="font-semibold text-blue-600 cursor-pointer">
                      #442 Navigation Fixes
                    </span>
                  </p>
                  <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 block">
                    3 hours ago
                  </span>
                </div>

                <div className="relative text-xs sm:text-sm">
                  <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-300 ring-4 ring-white"></span>
                  <p className="text-gray-800 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      David Kim
                    </span>{" "}
                    commented on{" "}
                    <span className="font-semibold text-blue-600 cursor-pointer">
                      Mobile App Design Specs
                    </span>
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-[11px] sm:text-xs text-gray-600 italic">
                    Let us make sure the contrast on the secondary buttons
                    passes WCAG guidelines...
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-400 mt-1.5 block">
                    Yesterday
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 text-blue-600 border-dashed border-blue-200 hover:bg-blue-50 cursor-pointer text-sm"
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
