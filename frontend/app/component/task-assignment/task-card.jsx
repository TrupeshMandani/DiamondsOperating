"use client"

import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getPriorityColor, getStatusColor } from "./utils"

export function TaskCard({ task, handleDeleteTask }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{task.description}</CardTitle>
            <CardDescription className="flex items-center mt-1 ">
              <Users className="h-4 w-4 mr-1" />
              {task.employeeName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Due: {formatDate(task.dueDate)}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Assigned: {formatDate(task.assignedDate)}
          </div>
          <div className="flex items-center">
            <span className="mr-2">Priority:</span>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task._id)}>
          Delete Task
        </Button>
      </CardFooter>
    </Card>
  )
}

