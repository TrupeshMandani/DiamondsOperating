"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const TasksDistributionChart = ({ tasks }) => {
  // Count tasks by status
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  // Convert to array for chart
  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <ChartContainer
      config={{
        completed: {
          label: "Completed",
          color: "hsl(var(--chart-1))",
        },
        inProgress: {
          label: "In Progress",
          color: "hsl(var(--chart-2))",
        },
        pending: {
          label: "Pending",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase().replace(" ", "")})`} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default TasksDistributionChart

