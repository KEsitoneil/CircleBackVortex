import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">About CircleBackVortex</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="prose prose-slate max-w-none">
          <p className="text-xl">
            CircleBackVortex was created to solve a common problem in organizations: the disappearance of action items
            from meetings.
          </p>

          <h2>The Problem</h2>
          <p>
            A Fortune 500 internal audit found that 40% of action items from leadership meetings were never followed up
            on. Not delayed, just vanished. In another case, a project manager tracked how many tasks ended with "we'll
            discuss this later" - the number hit 57 in just 2 sprints.
          </p>

          <h2>Our Solution</h2>
          <p>
            CircleBackVortex uses AI to detect ghosted tasks, postponed decisions, and vanishing follow-ups, then
            surfaces them automatically with context, timing, and owner information. Our platform helps teams:
          </p>

          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>Identify tasks that have fallen through the cracks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>Track follow-up rates and improve accountability</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>Analyze patterns to prevent future task ghosting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>Increase team productivity and reduce wasted time</span>
            </li>
          </ul>

          <h2>How It Works</h2>
          <p>
            Our platform analyzes task data from your meetings and project management tools, identifying patterns that
            indicate a task might be at risk of being ghosted. The AI engine considers factors like:
          </p>

          <ul>
            <li>Time since last mention</li>
            <li>Presence of follow-up scheduling</li>
            <li>Task ownership clarity</li>
            <li>Historical patterns of similar tasks</li>
          </ul>

          <p>
            Based on this analysis, CircleBackVortex provides actionable insights and recommendations to help your team
            stay on track and ensure no important task gets left behind.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/upload">Try It Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
