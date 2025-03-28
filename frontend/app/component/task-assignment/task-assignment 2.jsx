"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import io from "socket.io-client"

import { TaskAssignmentDialog } from "./task-assignment-dialog"
import { TaskCard } from "./task-card"
import { ProcessFlow } from "./process-flow"
import { EmptyTasksPlaceholder } from "./empty-tasks-placeholder"
import { useTaskManagement } from "./use-task-management"
import { useBatchManagement } from "./use-batch-management"

// Process types for diamond processing
const PROCESS_TYPES = ["Sarin", "Stitching", "4P Cutting"]
const socket = io("http://localhost:5023")

export default function TaskAssignment() {
  const [selectedProcess, setSelectedProcess] = useState(PROCESS_TYPES[0])
  const [isAssigningTask, setIsAssigningTask] = useState(false)

  const {
    batches,
    employees,
    selectedBatch,
    loading,
    fetchBatches,
    fetchEmployees,
    handleBatchSelect,
    fetchUpdatedBatch,
  } = useBatchManagement(socket)

  const { tasks, newTask, setNewTask, tempTaskIds, handleAssignTask, handleDeleteTask, fetchTasksForBatch, getTaskId } =
    useTaskManagement(socket, selectedBatch, selectedProcess, fetchUpdatedBatch)

  // Handle process selection
  const handleProcessSelect = (process) => {
    setSelectedProcess(process)
  }

  // Filter tasks by process
  const filteredTasks = tasks.filter((task) => task.currentProcess === selectedProcess)

  useEffect(() => {
    fetchBatches()
    fetchEmployees()
  }, [fetchBatches, fetchEmployees])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 text-black ">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Assignment</h1>
          <div className="flex space-x-4 text-black">
            <Select onValueChange={handleBatchSelect} value={selectedBatch?.batchId || ""}>
              <SelectTrigger className=" text-black w-[200px]">
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {batches.map((batch, index) => (
                  <SelectItem key={`batch-${batch.batchId}-${index}`} value={batch.batchId}>
                    {batch.batchId} - {batch.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedBatch ? (
          <>
            <Card className="bg-white shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Batch: {selectedBatch.batchId}</CardTitle>
                    <CardDescription>
                      Current Process: {selectedBatch.currentProcess} | Status: {selectedBatch.status}
                    </CardDescription>
                  </div>
                  <TaskAssignmentDialog
                    isOpen={isAssigningTask}
                    setIsOpen={setIsAssigningTask}
                    selectedProcess={selectedProcess}
                    selectedBatch={selectedBatch}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    employees={employees}
                    handleAssignTask={handleAssignTask}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={PROCESS_TYPES[0]} className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0">
                    {PROCESS_TYPES.map((process, index) => (
                      <TabsTrigger
                        key={`process-tab-${process}-${index}`}
                        value={process}
                        onClick={() => handleProcessSelect(process)}
                        className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                      >
                        {process}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {PROCESS_TYPES.map((process, index) => (
                    <TabsContent key={`tab-content-${process}-${index}`} value={process} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task, index) => (
                            <TaskCard
                              key={`${getTaskId(task)}-${index}`}
                              task={task}
                              handleDeleteTask={handleDeleteTask}
                            />
                          ))
                        ) : (
                          <EmptyTasksPlaceholder process={process} setIsAssigningTask={setIsAssigningTask} />
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <ProcessFlow PROCESS_TYPES={PROCESS_TYPES} selectedBatch={selectedBatch} filteredTasks={filteredTasks} />
          </>
        ) : (
          <Card className="bg-white shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <ArrowRight className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Select a Batch to Begin</h3>
              <p className="text-gray-500 text-center max-w-md">
                Choose a batch from the dropdown above to view and assign tasks to employees
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

