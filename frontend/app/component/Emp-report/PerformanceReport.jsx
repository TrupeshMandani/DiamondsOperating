"use client"

import { useState, useEffect } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Calendar, Clock, CheckCircle, DollarSign } from "lucide-react"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const PerformanceReport = ({ tasks, earningsData }) => {
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    partiallyCompleted: 0,
    totalTasks: 0,
    totalDiamonds: 0,
    completedDiamonds: 0,
    avgCompletionTime: 0,
    onTimeCompletion: 0,
    highPriorityCompleted: 0,
  })

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      calculateTaskStats(tasks)
    }
  }, [tasks])

  // Calculate task statistics
  const calculateTaskStats = (tasksData) => {
    if (!tasksData.length) {
      return
    }

    const completed = tasksData.filter((task) => task.status === "Completed").length
    const inProgress = tasksData.filter((task) => task.status === "In Progress").length
    const pending = tasksData.filter((task) => task.status === "Pending").length
    const partiallyCompleted = tasksData.filter((task) => task.status === "Partially Completed").length

    const totalDiamonds = tasksData.reduce((sum, task) => sum + task.diamondNumber, 0)
    const completedDiamonds = tasksData.reduce((sum, task) => sum + (task.completedDiamonds || 0), 0)

    // Calculate average completion time in minutes for completed tasks
    const completedTasks = tasksData.filter((task) => task.status === "Completed" && task.durationInMinutes)
    const avgCompletionTime = completedTasks.length
      ? completedTasks.reduce((sum, task) => sum + task.durationInMinutes, 0) / completedTasks.length
      : 0

    // Calculate on-time completion rate
    const tasksWithDueDate = tasksData.filter((task) => task.status === "Completed" && task.dueDate && task.completedAt)
    const onTimeCompletions = tasksWithDueDate.filter((task) => {
      return new Date(task.completedAt) <= new Date(task.dueDate)
    }).length
    const onTimeCompletionRate = tasksWithDueDate.length ? (onTimeCompletions / tasksWithDueDate.length) * 100 : 0

    // High priority tasks completed
    const highPriorityCompleted = tasksData.filter(
      (task) => task.priority === "High" && task.status === "Completed",
    ).length

    setTaskStats({
      completed,
      inProgress,
      pending,
      partiallyCompleted,
      totalTasks: tasksData.length,
      totalDiamonds,
      completedDiamonds,
      avgCompletionTime,
      onTimeCompletion: onTimeCompletionRate,
      highPriorityCompleted,
    })
  }

  // Prepare task status chart data
  const prepareTaskStatusChartData = () => {
    return {
      labels: ["Completed", "In Progress", "Pending", "Partially Completed"],
      datasets: [
        {
          data: [taskStats.completed, taskStats.inProgress, taskStats.pending, taskStats.partiallyCompleted],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  // Prepare earnings chart data
  const prepareEarningsChartData = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const monthlyEarningsData = Array(12).fill(0)

    if (earningsData && earningsData.length > 0) {
      earningsData.forEach((entry) => {
        const monthIndex = entry.month - 1
        monthlyEarningsData[monthIndex] = entry.totalEarnings
      })
    }

    return {
      labels: months,
      datasets: [
        {
          label: "Monthly Earnings",
          data: monthlyEarningsData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div>
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <h3 className="font-semibold text-gray-700">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold">
            {taskStats.totalTasks ? Math.round((taskStats.completed / taskStats.totalTasks) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500">
            {taskStats.completed} of {taskStats.totalTasks} tasks completed
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <DollarSign className="text-blue-500 mr-2" size={20} />
            <h3 className="font-semibold text-gray-700">Diamonds Processed</h3>
          </div>
          <p className="text-3xl font-bold">
            {taskStats.completedDiamonds} / {taskStats.totalDiamonds}
          </p>
          <p className="text-sm text-gray-500">
            {taskStats.totalDiamonds ? Math.round((taskStats.completedDiamonds / taskStats.totalDiamonds) * 100) : 0}%
            completion rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Clock className="text-purple-500 mr-2" size={20} />
            <h3 className="font-semibold text-gray-700">Avg. Completion Time</h3>
          </div>
          <p className="text-3xl font-bold">{Math.round(taskStats.avgCompletionTime)} min</p>
          <p className="text-sm text-gray-500">Per completed task</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Calendar className="text-red-500 mr-2" size={20} />
            <h3 className="font-semibold text-gray-700">On-Time Completion</h3>
          </div>
          <p className="text-3xl font-bold">{Math.round(taskStats.onTimeCompletion)}%</p>
          <p className="text-sm text-gray-500">Tasks completed before deadline</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700 mb-4">Task Status Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={prepareTaskStatusChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Earnings</h3>
          <div className="h-64">
            <Bar
              data={prepareEarningsChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-500">High Priority Tasks Completed</p>
            <p className="text-xl font-bold">{taskStats.highPriorityCompleted}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-500">Tasks In Progress</p>
            <p className="text-xl font-bold">{taskStats.inProgress}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-500">Partially Completed Tasks</p>
            <p className="text-xl font-bold">{taskStats.partiallyCompleted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceReport
