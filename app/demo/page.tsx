"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Pause, SkipForward } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function DemoPage() {
  const [step, setStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 5

  const startDemo = () => {
    setIsPlaying(true)
    toast({
      title: "Demo started",
      description: "Watch how CircleBackVortex helps you track ghosted tasks",
    })

    // Auto-advance through steps
    const interval = setInterval(() => {
      setStep((current) => {
        if (current >= totalSteps) {
          clearInterval(interval)
          setIsPlaying(false)
          return totalSteps
        }
        return current + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }

  const pauseDemo = () => {
    setIsPlaying(false)
    toast({
      title: "Demo paused",
      description: "Take your time to explore each step",
    })
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      toast({
        title: "Demo completed",
        description: "You've seen all the steps of the demo",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">CircleBackVortex Demo</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Step {step} of {totalSteps}
        </div>
        <div className="flex gap-2">
          {isPlaying ? (
            <Button size="sm" onClick={pauseDemo}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={startDemo}>
              <Play className="mr-2 h-4 w-4" />
              Auto-Play
            </Button>
          )}
          <Button size="sm" onClick={nextStep} disabled={step >= totalSteps}>
            <SkipForward className="mr-2 h-4 w-4" />
            Next
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How CircleBackVortex Works</CardTitle>
          <CardDescription>
            Follow this demo to see how our AI-powered platform helps you track and manage ghosted tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="step-1">Step 1</TabsTrigger>
              <TabsTrigger value="step-2">Step 2</TabsTrigger>
              <TabsTrigger value="step-3">Step 3</TabsTrigger>
              <TabsTrigger value="step-4">Step 4</TabsTrigger>
              <TabsTrigger value="step-5">Step 5</TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Your Task Data</h3>
                <p>
                  Start by uploading your CSV file containing task information from meetings and project management
                  tools. CircleBackVortex will analyze this data to identify patterns of postponed decisions and
                  vanishing follow-ups.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push("/upload")}>Try Uploading</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step-2" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">AI Analysis</h3>
                <p>
                  Our AI engine analyzes your task data to identify ghosted tasks - those that were mentioned but never
                  followed up on. The system looks for patterns like tasks without scheduled follow-ups, tasks that
                  haven't been mentioned for extended periods, and tasks with overdue deadlines.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => setStep(3)}>See Results</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step-3" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Insights</h3>
                <p>
                  The dashboard provides visual analytics showing the distribution of tasks by status, project, and
                  owner. You can quickly see how many tasks are ghosted, followed up on, or completed, as well as the
                  average delay in follow-ups.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push("/dashboard")}>View Dashboard</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step-4" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Task Management</h3>
                <p>
                  CircleBackVortex makes it easy to manage ghosted tasks. You can schedule follow-ups, update task
                  statuses, and export your data for reporting. The system automatically tracks when tasks are followed
                  up on and updates the analytics accordingly.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => setStep(5)}>Next Steps</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step-5" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Continuous Improvement</h3>
                <p>
                  As you use CircleBackVortex, the AI learns from your team's patterns and provides increasingly
                  accurate predictions about which tasks are at risk of being ghosted. The system also suggests process
                  improvements to reduce the number of ghosted tasks over time.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push("/")}>Get Started</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
