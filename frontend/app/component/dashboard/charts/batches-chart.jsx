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
    Active: "hsl(var(--chart-1))",
    Pending: "hsl(var(--chart-2))",
    Completed: "hsl(var(--chart-3))",
    "On Hold": "hsl(var(--chart-4))",
  }

  return (
    <ChartContainer
      config={{
        active: {
          label: "Active",
          color: "hsl(var(--chart-1))",
        },
        pending: {
          label: "Pending",
          color: "hsl(var(--chart-2))",
        },
        completed: {
          label: "Completed",
          color: "hsl(var(--chart-3))",
        },
        onHold: {
          label: "On Hold",
          color: "hsl(var(--chart-4))",
        },
      }}
    >
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
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || `hsl(var(--chart-${index + 1}))`} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default BatchesChart

