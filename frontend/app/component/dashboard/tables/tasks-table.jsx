import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { CalendarClock, Timer } from "lucide-react";

const TasksTable = ({ tasks, employees }) => {
  const findEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return (
      employee || {
        name:
          tasks.find((task) => task.assignedTo === employeeId)?.employeeName ||
          "Unassigned",
        avatar: null,
      }
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      case "Pending":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "warning";
      case "Low":
        return "outline";
      default:
        return "default";
    }
  };

  const getTimeTaken = (start, end) => {
    if (!start || !end) return "-";
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return "-";
    const diffMs = endDate - startDate;
    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Time Taken</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const employee = findEmployee(task.assignedTo);
              const timeTaken = getTimeTaken(task.startTime, task.endTime);

              return (
                <TableRow key={task.id || task._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={employee.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={employee.name}
                        />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof task.batchId === "object"
                      ? "Batch #" +
                        (task.batchId._id || "").toString().substring(0, 6)
                      : task.batchId || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.status === "Completed" && task.startTime && task.endTime ? (
                      <div
                        className="flex items-center gap-2"
                        title={`Started: ${new Date(task.startTime).toLocaleString()}\nEnded: ${new Date(task.endTime).toLocaleString()}`}
                      >
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span>{timeTaken}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
