"use client"

import { Calendar, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const DashboardHeader = ({ notifications }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground border-l-4 border-blue-500 pl-4">
          Diamond Management Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Overview of your diamond batches, employees, and tasks</p>
      </div>
      <div className="flex space-x-2 items-center">
        <Badge variant="outline" className="text-sm py-1.5">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Badge>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default DashboardHeader

