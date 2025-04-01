"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import BatchesChart from "../charts/batches-chart"
import EmployeePerformanceChart from "../charts/employee-performance-chart"
import TasksDistributionChart from "../charts/tasks-distribution-chart"
import RevenueChart from "../charts/revenue-chart"

const DashboardCharts = ({ data }) => {
  const { batches, employees, tasks, revenueData } = data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Batch Status Distribution</CardTitle>
          <CardDescription>Overview of all batches by status</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BatchesChart batches={batches} />
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Employee Performance</CardTitle>
          <CardDescription>Tasks completed by top employees</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <EmployeePerformanceChart employees={employees} />
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Tasks Distribution</CardTitle>
          <CardDescription>Tasks by status and priority</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <TasksDistributionChart tasks={tasks} />
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue from processed diamonds</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <RevenueChart data={revenueData} />
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardCharts

