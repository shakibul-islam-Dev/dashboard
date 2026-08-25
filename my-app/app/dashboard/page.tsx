"use client";

import { useState, useEffect } from "react";
import { Zap, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PathProvider from "@/components/customsUi/PathProvider";
import Link from "next/link";
import { dashboardProjects } from "@/data/projects";
import { dashboardStats } from "@/data/analytics";
import { recentActivityData } from "@/data/activity";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import LoadingSkeletonDashboard from "@/components/customsUi/LoadingSkeletonDashboard";
import DashboardErrorCard from "@/components/customsUi/DashboardErrorCard";
import { motion } from "motion/react";

export default function DashboardHome() {
  // ── Loading state ──
  const [loading, setLoading] = useState(true);
  // ── Error state ──
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeletonDashboard />;
  if (error) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 w-full max-w-7xl mx-auto">
        <RouterNavigation />
        <PathProvider />
        <DashboardErrorCard onRetry={() => setError(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 w-full max-w-7xl mx-auto">
      {/* Top Header Section */}
      <RouterNavigation />
      <PathProvider />
      <Card className="border-border shadow-sm">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Overview of your projects, tasks and team activity.
            </p>
          </div>
          <Link href={`/dashboard/projects`}>
            <motion.div
              initial={{
                y: 10,
              }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer w-full sm:w-fit shadow-sm">
                <Zap className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </motion.div>
          </Link>
        </CardContent>
      </Card>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="  border-border shadow-sm">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className="w-4 h-4 " />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-bold ${
                    stat.isNegative ? "text-rose-600" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </span>
                {stat.badge && (
                  <Badge
                    variant={stat.isNegative ? "destructive" : "secondary"}
                    className="text-xs font-semibold"
                  >
                    {stat.badge}
                  </Badge>
                )}
                {stat.note && (
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-normal">
                    {stat.note}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section: Project Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Project Progress */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Project Progress
            </h2>
            <Button
              variant="link"
              className="text-primary p-0 h-auto font-medium text-sm"
            >
              <Link href="/dashboard/projects">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardProjects.map((proj) => (
              <Card
                key={proj.id}
                className={`border-border cursor-pointer shadow-sm border-l-4 ${proj.borderColor} hover:shadow-md transition-shadow`}
              >
                <Link
                  href={`/dashboard/projects/${proj.id}`}
                  className="block h-full"
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          {proj.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-muted text-foreground font-medium text-xs"
                        >
                          {proj.tag}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">
                          {proj.progress}%
                        </span>
                      </div>
                      <Progress value={proj.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-muted-foreground">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {proj.avatars.map((av, i) => (
                          <Avatar
                            key={i}
                            className="w-6 h-6 border-2 border-white"
                          >
                            <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                              {av}
                            </AvatarFallback>
                          </Avatar>
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
        <Card className="border-border shadow-sm flex flex-col justify-between">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
                Recent Activity
              </h2>

              <div className="relative pl-4 space-y-6 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {recentActivityData.map((item) => (
                  <div key={item.id} className="relative text-xs sm:text-sm">
                    <span
                      className={`absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full ${item.dotColor} ring-4 ring-white`}
                    ></span>
                    <p className="text-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">
                        {item.actor}
                      </span>{" "}
                      {item.action}{" "}
                      {item.target &&
                        (item.targetIsCode ? (
                          <code className="bg-muted text-foreground px-1 py-0.5 rounded text-[11px] font-mono">
                            {item.target}
                          </code>
                        ) : (
                          <Link
                            href="/dashboard/activity"
                            className="font-semibold text-primary cursor-pointer hover:underline"
                          >
                            {item.target}
                          </Link>
                        ))}
                    </p>
                    {item.comment && (
                      <div className="mt-2 p-3 bg-muted border border-border rounded-lg text-[11px] sm:text-xs text-muted-foreground italic">
                        {item.comment}
                      </div>
                    )}
                    <span className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 block">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/activity">
              <Button
                variant="outline"
                className="w-full mt-6 text-primary border-dashed border-primary/30 hover:bg-primary/10 cursor-pointer text-sm"
              >
                View All Activity
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
