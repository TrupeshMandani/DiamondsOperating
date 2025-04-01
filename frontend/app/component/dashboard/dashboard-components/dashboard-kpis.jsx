"use client"

import { Diamond, Users, CheckCircle, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const DashboardKPIs = ({ data }) => {
  const { totalBatches, activeBatches, employees, completionRate, completedTasks, tasks, employeeUtilization } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
          <Diamond className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBatches}</div>
          <p className="text-xs text-muted-foreground">{activeBatches} active batches</p>
          <div className="mt-3">
            <Progress value={(activeBatches / totalBatches) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employees.length}</div>
          <div className="flex items-center pt-1">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-500">+2 this month</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
          <div className="mt-3">
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Employee Utilization</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeUtilization}%</div>
          <div className="flex items-center pt-1">
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-xs text-red-500">-5% from last week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardKPIs

