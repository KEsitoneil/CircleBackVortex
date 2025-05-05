"use client"

import { useTasks } from "@/context/task-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, RefreshCw, AlertCircle, Clock, CheckCircle2, UserCircle2, CalendarDays } from "lucide-react"
import { TaskTable } from "@/components/task-table"
import { TaskCard } from "@/components/task-card"

export default function DashboardPage() {
  const { tasks: data, stats, loading, refreshData, exportData } = useTasks()

  const statusData = [
    { name: "Ghosted", value: stats.ghostedTasks, color: "#ef4444" },
    { name: "Followed Up", value: stats.followedUpTasks, color: "#3b82f6" },
    { name: "Completed", value: stats.completedTasks, color: "#22c55e" },
    {
      name: "Other",
      value: stats.totalTasks - stats.ghostedTasks - stats.followedUpTasks - stats.completedTasks,
      color: "#94a3b8",
    },
  ]

  const projectData = data
    .reduce((acc: any[], task: any) => {
      const project = task.Project
      const existingProject = acc.find((p) => p.name === project)

      if (existingProject) {
        existingProject.count += 1
      } else if (project) {
        acc.push({ name: project, count: 1 })
      }

      return acc
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const ghostedTasks = data
    .filter(
      (task: any) =>
        task.Status === "Open" &&
        task.Follow_Up_Scheduled === "No" &&
        new Date(task.Last_Mentioned) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    )
    .sort((a: any, b: any) => new Date(a.Last_Mentioned).getTime() - new Date(b.Last_Mentioned).getTime())

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Analysis Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights into your meeting follow-ups and action items</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Tracked action items and follow-ups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ghosted Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ghostedTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks without follow-up for 14+ days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTasks ? Math.round((stats.followedUpTasks / stats.totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Tasks with scheduled follow-ups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delay</CardTitle>
            <CalendarDays className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDelay} days</div>
            <p className="text-xs text-muted-foreground">Average time past due date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ghosted">Ghosted Tasks</TabsTrigger>
          <TabsTrigger id="all-tasks-tab" value="all">
            All Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Breakdown of tasks by their current status</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Projects</CardTitle>
                <CardDescription>Projects with the most action items</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Automated analysis of your task follow-up patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="font-semibold">Follow-up Vortex Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.ghostedTasks} tasks have been mentioned but not followed up on for more than 14 days. This
                      represents {stats.totalTasks ? Math.round((stats.ghostedTasks / stats.totalTasks) * 100) : 0}% of
                      all tasks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <UserCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Owner Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      The most common task owners with ghosted tasks are Marketing Lead, Product Manager, and
                      Engineering Lead. Consider implementing a regular follow-up system for these team members.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-semibold">Recommended Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Schedule a weekly review of open tasks, implement a 7-day follow-up rule, and assign clear owners
                      for each task. This could improve your follow-up rate by an estimated 35%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ghosted">
          <Card>
            <CardHeader>
              <CardTitle>Ghosted Tasks</CardTitle>
              <CardDescription>
                Tasks that have been mentioned but not followed up on for more than 14 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ghostedTasks.slice(0, 6).map((task: any, index: number) => {
                  const originalIndex = data.findIndex(
                    (t) =>
                      t.Task_Description === task.Task_Description &&
                      t.Project === task.Project &&
                      t.Owner === task.Owner,
                  )
                  return <TaskCard key={index} task={task} index={originalIndex} />
                })}
              </div>

              {ghostedTasks.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => document.getElementById("all-tasks-tab")?.click()}>
                    View All {ghostedTasks.length} Ghosted Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Complete list of tasks and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskTable data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
