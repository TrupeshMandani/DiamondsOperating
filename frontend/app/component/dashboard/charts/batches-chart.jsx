"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const BatchesChart = ({ batches }) => {
  // Count batches by status
  const statusCounts = batches.reduce((acc, batch) => {
    acc[batch.status] = (acc[batch.status] || 0) + 1
    return acc
  }, {})

  // Convert to array for chart
  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for different statuses
  const COLORS = {
    "In Progress": "#3b82f6", // blue
    Assigned: "#10b981", // green
    Pending: "#f59e0b", // amber
    Completed: "#6b7280", // gray
  }

  return (
    <ChartContainer
      config={{
        inProgress: {
          label: "In Progress",
          color: "#3b82f6",
        },
        assigned: {
          label: "Assigned",
          color: "#10b981",
        },
        pending: {
          label: "Pending",
          color: "#f59e0b",
        },
        completed: {
          label: "Completed",
          color: "#6b7280",
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
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
        <div className="flex items-center justify-center h-full text-gray-500">No batch data available</div>
      )}
    </ChartContainer>
  )
}

export default BatchesChart

