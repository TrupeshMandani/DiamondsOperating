"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const EmployeePerformanceChart = ({ employees }) => {
  // Calculate performance for each employee
  const performanceData = employees.map((emp) => ({
    name: emp.name.split(" ")[0], // First name only
    tasksCompleted: emp.completedTasks || 0,
    performance:
      emp.assignedTasks > 0
        ? Math.round((emp.completedTasks / emp.assignedTasks) * 100)
        : 0,
  }));

  // Sort and get top 5 by performance
  const topEmployees = performanceData
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5);

  return (
    <ChartContainer
      config={{
        performance: {
          label: "Performance (%)",
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
          <Bar
            dataKey="performance"
            fill="var(--color-performance)"
            name="Performance (%)"
          />
          <Bar
            dataKey="tasksCompleted"
            fill="var(--color-tasksCompleted)"
            name="Tasks Completed"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EmployeePerformanceChart;
