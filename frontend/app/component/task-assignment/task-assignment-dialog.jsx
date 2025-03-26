"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"

export function TaskAssignmentDialog({
  isOpen,
  setIsOpen,
  selectedProcess,
  selectedBatch,
  newTask,
  setNewTask,
  employees,
  handleAssignTask,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Assign New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-50 text-black rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Assign Task for {selectedProcess}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Create a new task for batch {selectedBatch.batchId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Employee</label>
            <Select
              onValueChange={(value) => setNewTask({ ...newTask, employeeId: value })}
              value={newTask.employeeId}
              className="text-black"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white w-full">
                {employees.map((employee, index) => (
                  <SelectItem key={`employee-${employee._id}-${index}`} value={employee._id.toString()}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              className="p-2 border rounded w-full"
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <DatePicker date={newTask.dueDate} setDate={(date) => setNewTask({ ...newTask, dueDate: date })} />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              value={newTask.priority}
              className="text-black"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white w-full">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignTask} className="ml-2">
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

