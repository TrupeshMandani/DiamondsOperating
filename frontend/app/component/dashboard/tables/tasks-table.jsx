import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarClock } from "lucide-react"

const TasksTable = ({ tasks, employees }) => {
  // Helper function to find employee by ID
  const findEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    return (
      employee || {
        name: tasks.find((task) => task.assignedTo === employeeId)?.employeeName || "Unassigned",
        avatar: null,
      }
    )
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success"
      case "In Progress":
        return "warning"
      case "Pending":
        return "outline"
      default:
        return "default"
    }
  }

  // Get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "warning"
      case "Low":
        return "outline"
      default:
        return "default"
    }
  }

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const employee = findEmployee(task.assignedTo)
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
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
                      ? "Batch #" + (task.batchId._id || "").toString().substring(0, 6)
                      : task.batchId || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.dueDate}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default TasksTable

