"use client";

import { Calendar, Clock, Users, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getPriorityColor, getStatusColor } from "./utils";

export function TaskCard({ task, handleDeleteTask, handleReassignTask }) {
  const handleReassign = () => {
    if (typeof handleReassignTask === "function") {
      console.log("🔁 Reassign clicked for task:", task);
      handleReassignTask(task); // ✅ Trigger parent dialog open
    } else {
      console.warn("⚠️ handleReassignTask is not defined or not a function");
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              {task.description}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
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
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>

          {/* ✅ Enhanced Partial Completion Block */}
          {task.status === "Partially Completed" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-sm text-yellow-800 mt-2">
              <p className="font-medium">⚠️ Partially Completed</p>

              {task.partialReason && (
                <p className="mt-1">
                  Reason: <span className="italic">{task.partialReason}</span>
                </p>
              )}

              {typeof task.completedDiamonds === "number" &&
                typeof task.remainingDiamonds === "number" && (
                  <p className="mt-1">
                    💎 Completed:{" "}
                    <span className="font-semibold text-green-800">
                      {task.completedDiamonds}
                    </span>{" "}
                    / Remaining:{" "}
                    <span className="font-semibold text-red-700">
                      {task.remainingDiamonds}
                    </span>
                  </p>
                )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        {/* ✅ Show Reassign only if task is Partially Completed */}
        {task.status === "Partially Completed" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReassign}
            className="transition hover:scale-[1.02]"
          >
            <Repeat className="h-4 w-4 mr-1" />
            Reassign Task
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteTask(task._id)}
        >
          Delete Task
        </Button>
      </CardFooter>
    </Card>
  );
}
