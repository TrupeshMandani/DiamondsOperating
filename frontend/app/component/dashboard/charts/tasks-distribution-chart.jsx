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

  // Colors for different statuses
  const COLORS = {
    Completed: "#10b981", // green
    "In Progress": "#3b82f6", // blue
    Pending: "#f59e0b", // amber
  }

  return (
    <ChartContainer
      config={{
        completed: {
          label: "Completed",
          color: "#10b981",
        },
        inProgress: {
          label: "In Progress",
          color: "#3b82f6",
        },
        pending: {
          label: "Pending",
          color: "#f59e0b",
        },
      }}
    >
      {data.length > 0 ? (
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">No task data available</div>
      )}
    </ChartContainer>
  )
}

export default TasksDistributionChart

