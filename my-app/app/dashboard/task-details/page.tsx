"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import PathProvider from "@/components/customsUi/PathProvider";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TaskDetailsPage = () => {
  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
      <RouterNavigation />
      <PathProvider />

      {/* Header with back navigation */}
      <div className="mb-6">
        <Link href="/dashboard/my-tasks">
          <Button variant="ghost" className="gap-2 mb-4 -ml-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Task Details</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage task information.
        </p>
      </div>

      {/* Task detail placeholder layout */}
      <div className="max-w-4xl space-y-6">
        {/* Main task info card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ArrowLeft className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Select a task from My Tasks to view details
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Navigate to My Tasks and click on any task to see its full
                details, status, assignees, and comments here.
              </p>
              <Link href="/dashboard/my-tasks" className="mt-6">
                <Button size="sm">Go to My Tasks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder sub-cards for future detail sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className="text-sm text-foreground">--</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Assignee
              </p>
              <p className="text-sm text-foreground">--</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Due Date
              </p>
              <p className="text-sm text-foreground">--</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
