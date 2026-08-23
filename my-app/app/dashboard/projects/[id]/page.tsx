import PathProvider from "@/components/customsUi/PathProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  MoreVertical,
  Plus,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ProjectDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailsProps) {
  const { id } = await params;

  // Mock data mapping based on project ID
  const projectData = {
    id: id,
    title:
      id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Project Details",
    description:
      "Comprehensive platform overhaul focusing on scalability, user performance, design systems, and security compliance.",
    status: "In Progress",
    dueDate: "Oct 28, 2026",
    progress: 68,
    members: [
      {
        name: "Sarah Jenkins",
        role: "Lead Designer",
        avatar: "/avatars/01.png",
        fallback: "SJ",
      },
      {
        name: "Mike Chen",
        role: "Frontend Dev",
        avatar: "/avatars/02.png",
        fallback: "MC",
      },
      {
        name: "Elena Rostova",
        role: "Backend Dev",
        avatar: "/avatars/03.png",
        fallback: "ER",
      },
    ],
    stats: {
      totalTasks: 34,
      completedTasks: 23,
      pendingTasks: 11,
      hoursLogged: 142,
    },
    tasks: [
      {
        id: 1,
        title: "Finalize high-fidelity wireframes",
        status: "Completed",
        assignee: "Sarah Jenkins",
      },
      {
        id: 2,
        title: "Setup authentication API routes & RBAC",
        status: "In Progress",
        assignee: "Elena Rostova",
      },
      {
        id: 3,
        title: "Optimize bundle size & Next.js page load times",
        status: "Pending",
        assignee: "Mike Chen",
      },
    ],
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* Top Navigation & Actions */}
      <PathProvider />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500"
              asChild
            >
              <Link href="/dashboard/projects">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {projectData.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {projectData.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1 font-medium">
            {projectData.status}
          </Badge>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add Task
          </Button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Overall Progress
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {projectData.progress}%
              </h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Tasks Completed
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {projectData.stats.completedTasks} /{" "}
                {projectData.stats.totalTasks}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Target Completion
              </p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                {projectData.dueDate}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Logged Hours</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {projectData.stats.hoursLogged} hrs
              </h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections using Tabs */}
      <Tabs defaultValue="tasks" className="w-full space-y-4">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Team Members
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Files & Docs
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Project Tasks
              </CardTitle>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {projectData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Assigned to: {task.assignee}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-900">
                Assigned Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectData.members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab Placeholder */}
        <TabsContent value="files">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">
                No files uploaded yet for project ID: {id}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
