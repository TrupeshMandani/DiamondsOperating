"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyTasksPlaceholder({ process, setIsAssigningTask }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
      <AlertCircle className="h-12 w-12 mb-2 text-gray-400" />
      <p>No tasks assigned for {process} yet</p>
      <Button variant="outline" className="mt-4" onClick={() => setIsAssigningTask(true)}>
        Assign First Task
      </Button>
    </div>
  )
}

