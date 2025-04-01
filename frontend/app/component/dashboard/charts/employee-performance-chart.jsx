"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const EmployeePerformanceChart = ({ employees }) => {
  // Sort employees by performance and take top 5
  const topEmployees = [...employees]
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
          <Bar dataKey="performance" fill="var(--color-performance)" name="Performance %" />
          <Bar dataKey="tasksCompleted" fill="var(--color-tasksCompleted)" name="Tasks Completed" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default EmployeePerformanceChart

