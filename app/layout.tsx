import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { TaskProvider } from "@/context/task-context"

export const metadata: Metadata = {
  title: "CircleBackVortex - AI-Powered Task Follow-Up Tracker",
  description: "Detect ghosted tasks, postponed decisions, and vanishing follow-ups automatically",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>
          {children}
          <Toaster />
        </TaskProvider>
      </body>
    </html>
  )
}
