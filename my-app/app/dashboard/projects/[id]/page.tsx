import PathProvider from "@/components/customsUi/PathProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  Plus,
  Users,
  Zap,
} from "lucide-react";
// import Link from "next/link";
import { getProjectDetails } from "@/data/projects";
import RouterNavigation from "@/components/customsUi/RouterNavigation";

interface ProjectDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailsProps) {
  const { id } = await params;

  // Demo data fetched from central data folder
  const projectData = getProjectDetails(id);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-transparent min-h-screen">
      {/* Top Navigation & Actions */}
      <RouterNavigation />
      <PathProvider />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
            >
              <Link href="/dashboard/projects">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
              </Link>
            </Button>
          </div> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {projectData.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projectData.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15 px-3 py-1 font-medium">
            {projectData.status}
          </Badge>
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add Task
          </Button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Overall Progress
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {projectData.progress}%
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Tasks Completed
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {projectData.stats.completedTasks} /{" "}
                {projectData.stats.totalTasks}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Target Completion
              </p>
              <h3 className="text-lg font-bold text-foreground mt-1">
                {projectData.dueDate}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Logged Hours
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
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
        <div className="overflow-x-auto -mx-1 px-1 pb-1">
          <TabsList className="bg-card border border-border p-1 rounded-lg min-w-max">
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
        </div>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-foreground">
                Project Tasks
              </CardTitle>
              {/* <Button variant="outline" size="sm">
                Filter
              </Button> */}
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {projectData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between gap-3 flex-wrap hover:bg-muted/50"
                  >
                    <div className="flex items-center flex-wrap gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Assigned Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectData.members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab Placeholder */}
        <TabsContent value="files">
          <Card className="border-border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
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
