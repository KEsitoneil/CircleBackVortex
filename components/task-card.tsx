"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, UserCircle2 } from "lucide-react"
import { useTasks } from "@/context/task-context"

interface TaskCardProps {
  task: any
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  // Calculate days since last mentioned
  const lastMentioned = new Date(task.Last_Mentioned)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - lastMentioned.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const { scheduleFollowUp } = useTasks()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium line-clamp-1">{task.Task_Description}</CardTitle>
          <Badge variant="outline" className="ml-2 shrink-0">
            {task.Project}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs">
          <UserCircle2 className="mr-1 h-3 w-3" />
          {task.Owner}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="mr-1 h-3 w-3" />
            <span>Due: {new Date(task.Original_Due_Date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-xs text-destructive">
            <Clock className="mr-1 h-3 w-3" />
            <span>Last mentioned {diffDays} days ago</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          size="sm"
          className="w-full"
          onClick={() => scheduleFollowUp(index)}
          disabled={task.Follow_Up_Scheduled === "Yes"}
        >
          {task.Follow_Up_Scheduled === "Yes" ? "Follow-up Scheduled" : "Schedule Follow-up"}
        </Button>
      </CardFooter>
    </Card>
  )
}
