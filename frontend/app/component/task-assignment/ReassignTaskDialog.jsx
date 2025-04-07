"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { alertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

export function ReassignTaskDialog({
  open,
  onClose,
  task,
  employees,
  onReassign,
}) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [rate, setRate] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
    if (task) {
      setSelectedEmployee(task.employeeId?.toString() || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setRate(task.rate || "");
      setPriority(task.priority || "");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!selectedEmployee || !dueDate || !priority) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await onReassign(
        task,
        selectedEmployee,
        dueDate,
        rate,
        priority
      );
      onClose(); // close dialog
    } catch (err) {
      setError(err.message || "Failed to reassign task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-50 text-black rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Reassign Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Reassign task: <strong>{task?.description}</strong>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start space-x-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4">
            <alertCircle className="h-4 w-4 mt-0.5 text-red-600" />
            <div>{error}</div>
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <Label>Remaining Diamonds</Label>
            <Input
              value={task?.remainingDiamonds ?? ""}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Select Employee</Label>
            <Select
              onValueChange={setSelectedEmployee}
              value={selectedEmployee}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white w-full">
                {employees?.map((emp) => (
                  <SelectItem key={emp._id} value={emp._id.toString()}>
                    {emp.firstName} {emp.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Due Date</Label>
            <DatePicker date={dueDate} setDate={setDueDate} />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Rate</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Priority</Label>
            <Select onValueChange={setPriority} value={priority}>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="ml-2"
            disabled={loading || !selectedEmployee || !dueDate || !priority}
          >
            {loading ? "Reassigning..." : "Confirm Reassignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
