"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { parseCSV } from "@/lib/csv-parser"

type Task = {
  Project: string
  Task_Description: string
  Owner: string
  Status: string
  Mentioned_in_Meeting: string
  Original_Due_Date: string
  Last_Mentioned: string
  Follow_Up_Scheduled: string
  Final_Resolution: string
  [key: string]: string
}

type TaskContextType = {
  tasks: Task[]
  loading: boolean
  stats: {
    totalTasks: number
    ghostedTasks: number
    followedUpTasks: number
    completedTasks: number
    averageDelay: number
  }
  refreshData: () => Promise<void>
  scheduleFollowUp: (taskIndex: number) => void
  exportData: () => void
  updateTaskStatus: (taskIndex: number, newStatus: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTasks: 0,
    ghostedTasks: 0,
    followedUpTasks: 0,
    completedTasks: 0,
    averageDelay: 0,
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      // In a real app, we would fetch the uploaded CSV data from an API
      // For demo purposes, we'll fetch the sample CSV directly
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/week%202%20-%20Problem_5_-_Follow-Up_Vortex_Tracker-hUbtapEAWgegomXWj7eru5p8njHF9z.csv",
      )
      const csvText = await response.text()
      const parsedData = parseCSV(csvText)

      setTasks(parsedData)
      calculateStats(parsedData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const calculateStats = (data: Task[]) => {
    const ghosted = data.filter(
      (task) =>
        task.Status === "Open" &&
        task.Follow_Up_Scheduled === "No" &&
        new Date(task.Last_Mentioned) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    ).length

    const followedUp = data.filter((task) => task.Follow_Up_Scheduled === "Yes").length

    const completed = data.filter((task) => task.Status === "Closed" || task.Status === "Completed").length

    // Calculate average delay in days between due date and last mentioned
    const delays = data
      .filter((task) => task.Original_Due_Date && task.Last_Mentioned)
      .map((task) => {
        const dueDate = new Date(task.Original_Due_Date)
        const lastMentioned = new Date(task.Last_Mentioned)
        return Math.max(0, Math.floor((lastMentioned.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)))
      })

    const avgDelay = delays.length > 0 ? Math.round(delays.reduce((sum, delay) => sum + delay, 0) / delays.length) : 0

    setStats({
      totalTasks: data.length,
      ghostedTasks: ghosted,
      followedUpTasks: followedUp,
      completedTasks: completed,
      averageDelay: avgDelay,
    })
  }

  const scheduleFollowUp = (taskIndex: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      Follow_Up_Scheduled: "Yes",
      Last_Mentioned: new Date().toISOString().split("T")[0],
    }
    setTasks(updatedTasks)
    calculateStats(updatedTasks)
  }

  const updateTaskStatus = (taskIndex: number, newStatus: string) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      Status: newStatus,
    }
    setTasks(updatedTasks)
    calculateStats(updatedTasks)
  }

  const exportData = () => {
    // Create CSV content
    const headers = Object.keys(tasks[0] || {}).join(",")
    const rows = tasks.map((task) => Object.values(task).join(",")).join("\n")
    const csvContent = `${headers}\n${rows}`

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `circlebackvortex-export-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        stats,
        refreshData: fetchData,
        scheduleFollowUp,
        exportData,
        updateTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
