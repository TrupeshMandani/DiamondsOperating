"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const EmployeePerformanceChart = ({ employees, tasks }) => {
  // Filter tasks assigned in the last 7 days
  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const tasksLast7Days = tasks.filter((task) => {
    const assignedDate = new Date(task.assignedDate);
    return assignedDate >= last7Days;
  });

  // Get completed tasks from last 7 days
  const completedTasksLast7Days = tasksLast7Days.filter(
    (task) => task.status === "Completed"
  );

  // Map employee performance based on last 7 days
  const performanceData = employees.map((emp) => {
    const empId = emp.id || emp._id;

    const assigned = tasksLast7Days.filter(
      (task) => String(task.assignedTo) === String(empId)
    ).length;

    const completed = completedTasksLast7Days.filter(
      (task) => String(task.assignedTo) === String(empId)
    ).length;

    return {
      name: emp.name.split(" ")[0],
      tasksCompleted: completed,
      performance: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
    };
  });

  // Get top 5 employees by performance
  const topEmployees = performanceData
>>>>>>> Trupesh
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5)
    .map((emp) => ({
      name: emp.name.split(" ")[0], // Just first name for display
      performance: emp.performance,
      tasksCompleted: emp.completedTasks || 0,
    }))

  return (
    <ChartContainer
      config={{
        performance: {
          label: "Performance",
          color: "hsl(var(--chart-1))",
        },
        tasksCompleted: {
          label: "Tasks Completed",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topEmployees}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="performance" fill="#3B82F6" name="Performance %" />         {/* Blue-500 */}
          <Bar dataKey="tasksCompleted" fill="#10B981" name="Tasks Completed" />    {/* Green-500 */}

        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default EmployeePerformanceChart

