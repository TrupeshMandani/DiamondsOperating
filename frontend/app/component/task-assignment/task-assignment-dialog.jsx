"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertCircle } from "lucide-react";

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
  const [availableProcesses, setAvailableProcesses] = useState([]);
  const [error, setError] = useState("");
  const [maxAllowed, setMaxAllowed] = useState(null);

  useEffect(() => {
    setError("");

    if (selectedBatch?.selectedProcesses) {
      setAvailableProcesses(selectedBatch.selectedProcesses);
    } else if (selectedBatch) {
      setAvailableProcesses(
        Array.isArray(selectedBatch.currentProcess)
          ? selectedBatch.currentProcess
          : [selectedBatch.currentProcess]
      );
    }
  }, [selectedBatch, isOpen]);

  useEffect(() => {
    const fetchRemainingDiamonds = async () => {
      if (!selectedBatch || !selectedProcess) return;

      try {
        const res = await fetch(
          `http://localhost:5023/api/tasks/title/${selectedBatch.batchId}`
        );
        const data = await res.json();

        // Handle empty object response by converting to empty array
        const tasks = Array.isArray(data) ? data : [];

        const diamondsPerProcess = selectedBatch.diamondNumber;
        const processOrder = selectedBatch.selectedProcesses || [];
        const currentIndex = processOrder.indexOf(selectedProcess);
        const previousProcess =
          currentIndex > 0 ? processOrder[currentIndex - 1] : null;

        // ✅ Step 1: Ensure previous process is fully completed
        if (previousProcess) {
          const previousTasks = tasks.filter(
            (t) => t.process === previousProcess
          );

          const diamondsWorkedInPrevious = previousTasks.reduce(
            (sum, t) =>
              sum +
              (t.status === "Completed"
                ? t.diamondNumber
                : t.partialDiamondNumber || 0),
            0
          );

          if (diamondsWorkedInPrevious < diamondsPerProcess) {
            setError(
              `Cannot assign task for "${selectedProcess}" until "${previousProcess}" is completed for all diamonds.`
            );
            setMaxAllowed(0);
            return;
          }
        }

        // ✅ Step 2: Handle current process
        const currentTasks = tasks.filter((t) => t.process === selectedProcess);

        const currentCompleted = currentTasks.some(
          (t) => t.status === "Completed"
        );
        if (currentCompleted) {
          setError(`${selectedProcess} is already fully completed.`);
          setMaxAllowed(0);
          return;
        }

        const diamondsAlreadyWorked = currentTasks.reduce(
          (sum, t) =>
            sum +
            (t.status === "Completed"
              ? t.diamondNumber
              : t.partialDiamondNumber || 0),
          0
        );

        const remaining = diamondsPerProcess - diamondsAlreadyWorked;

        setNewTask((prev) => ({
          ...prev,
          diamondNumber: remaining,
        }));

        setMaxAllowed(remaining);

        if (remaining > 0) {
          setError(
            `Only ${remaining} diamonds remaining for ${selectedProcess}.`
          );
        } else {
          setError(`No diamonds remaining for ${selectedProcess}.`);
        }
      } catch (err) {
        console.error("Error checking remaining diamonds:", err);
        setError("Failed to validate task conditions.");
      }
    };

    fetchRemainingDiamonds();
  }, [selectedProcess, selectedBatch]);

  const isProcessAvailable =
    selectedProcess &&
    selectedBatch &&
    ((selectedBatch.selectedProcesses &&
      selectedBatch.selectedProcesses.includes(selectedProcess)) ||
      (Array.isArray(selectedBatch.currentProcess) &&
        selectedBatch.currentProcess.includes(selectedProcess)) ||
      selectedBatch.currentProcess === selectedProcess);

  const handleSubmit = () => {
    if (!isProcessAvailable) {
      setError(`Process "${selectedProcess}" is not available for this batch.`);
      return;
    }
    if (maxAllowed !== null && newTask.diamondNumber > maxAllowed) {
      setError(`Only ${maxAllowed} diamonds can be assigned.`);
      return;
    }
    handleAssignTask();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-300 text-white hover:text-black font-semibold rounded-md shadow-sm px-4 py-2">
          Assign New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-50 text-black rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Assign Task for {selectedProcess}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Create a new task for batch {selectedBatch?.batchId}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start space-x-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4">
            <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
            <div>{error}</div>
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Employee</label>
            <Select
              onValueChange={(value) =>
                setNewTask({ ...newTask, employeeId: value })
              }
              value={newTask.employeeId}
              className="text-black"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white w-full">
                {employees.map((employee, index) => (
                  <SelectItem
                    key={`employee-${employee._id}-${index}`}
                    value={employee._id.toString()}
                  >
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
            <DatePicker
              date={newTask.dueDate}
              setDate={(date) => setNewTask({ ...newTask, dueDate: date })}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Rate</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="p-2 border rounded w-full"
              placeholder="Enter rate"
              value={newTask.rate ?? ""}
              onChange={(e) => setNewTask({ ...newTask, rate: e.target.value })}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              onValueChange={(value) =>
                setNewTask({ ...newTask, priority: value })
              }
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

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Diamond Count</label>
            <input
              type="number"
              min="1"
              className="p-2 border rounded w-full"
              value={newTask.diamondNumber ?? ""}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  diamondNumber: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="ml-2"
            disabled={!isProcessAvailable}
          >
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
