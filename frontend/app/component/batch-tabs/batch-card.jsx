"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { getAssignmentProgress } from "./utils";
import { useState, useEffect } from "react";

export default function BatchCard({ batch, onSelect, category }) {
  const { assignmentStatus, completedProcesses, totalProcesses } =
    getAssignmentProgress(batch);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (
        (category === "inProgress" || category === "assigned") &&
        batch.batchId
      ) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://diamondsoperating.onrender.com/api/tasks/title/${encodeURIComponent(
              batch.batchId
            )}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const tasks = await response.json();
          // Filter tasks by status
          const inProgress = tasks.filter(
            (task) => task.status === "In Progress"
          );
          const completed = tasks.filter((task) => task.status === "Completed");
          setInProgressTasks(inProgress);
          setCompletedTasks(completed);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [category, batch.batchId]);

  // Determine card styling based on category
  const getCardStyle = () => {
    switch (category) {
      case "notAssigned":
        return "border-gray-200 hover:border-gray-300";
      case "inProgress":
        return "border-yellow-200 hover:border-yellow-300";
      case "assigned":
        return "border-blue-200 hover:border-blue-300";
      case "completed":
        return "border-green-200 hover:border-green-300";
      default:
        return "border-gray-200 hover:border-gray-300";
    }
  };

  // Get status badge styling
  const getStatusBadge = () => {
    switch (category) {
      case "notAssigned":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Assigned
          </Badge>
        );
      case "inProgress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "assigned":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Assigned
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`shadow-md hover:shadow-lg transition-all ${getCardStyle()}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {batch.batchId}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-500">
          Customer: {batch.firstName} {batch.lastName}
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Material:</span>
            <span className="font-medium">{batch.materialType}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Diamonds:</span>
            <span className="font-medium">
              {batch.diamondNumber} ({batch.diamondWeight} carats)
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Expected Date:</span>
            <span className="font-medium">
              {new Date(batch.expectedDate).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Process Assignment</span>
              <span className="text-xs font-medium">
                {completedProcesses}/{totalProcesses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  category === "completed"
                    ? "bg-green-500"
                    : category === "assigned"
                    ? "bg-blue-500"
                    : category === "inProgress"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
                style={{
                  width: `${(completedProcesses / totalProcesses) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {batch.selectedProcesses &&
              (Array.isArray(batch.selectedProcesses[0])
                ? batch.selectedProcesses.flat()
                : batch.selectedProcesses
              ).map((process) => {
                // Determine if this process is assigned
                const isAssigned =
                  batch.progress &&
                  batch.progress[process] !== undefined &&
                  batch.progress[process] > 0;

                // Determine if this process is completed
                const isCompleted =
                  batch.progress && batch.progress[process] === 100;

                // Determine if this process is in progress
                const isInProgress =
                  batch.progress &&
                  batch.progress[process] > 0 &&
                  batch.progress[process] < 100;

                return (
                  <Badge
                    key={process}
                    className={`
                    ${
                      isCompleted
                        ? "bg-green-100 text-green-800"
                        : isInProgress
                        ? "bg-yellow-100 text-yellow-800"
                        : isAssigned
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    {process}
                    {isCompleted && <CheckCircle className="w-3 h-3 ml-1" />}
                    {isInProgress && <Clock className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
          </div>
          {/* In Progress Tasks Section */}
          {category === "inProgress" && (
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Tasks In Progress:
              </div>
              {loading ? (
                <div className="text-sm text-gray-500">Loading tasks...</div>
              ) : inProgressTasks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <div>
                          <span className="text-sm font-medium text-yellow-800">
                            {task.description}
                          </span>
                          <div className="text-xs text-yellow-600">
                            Process: {task.currentProcess}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-600">
                        Assigned to: {task.employeeName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No tasks in progress
                </div>
              )}
            </div>
          )}

          {/* Completed Tasks Section - Show in both Assigned and In Progress tabs */}
          {(category === "assigned" || category === "inProgress") && (
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Completed Tasks:
              </div>
              {loading ? (
                <div className="text-sm text-gray-500">Loading tasks...</div>
              ) : completedTasks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {completedTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-green-800">
                            {task.description}
                          </span>
                          <div className="text-xs text-green-600">
                            Process: {task.currentProcess}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-green-600">
                        Completed by: {task.employeeName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No completed tasks</div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onSelect(batch)}
          className="w-full"
          variant={category === "notAssigned" ? "outline" : "default"}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
