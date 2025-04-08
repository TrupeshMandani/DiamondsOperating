"use client"

import { useRef } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Download } from "lucide-react"
import "jspdf-autotable"

const TaskHistory = ({ tasks }) => {
  const reportRef = useRef(null)

  // Export to PDF function using jsPDF with autotable
  const exportToPDF = async () => {
    if (!tasks || tasks.length === 0) {
      alert("No task data available to export")
      return
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Add title
      doc.setFontSize(18)
      doc.text("Task History Report", 14, 22)

      // Add date
      doc.setFontSize(11)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

      // Prepare table data
      const tableColumn = ["Batch", "Process", "Diamonds", "Status", "Due Date", "Priority", "Earnings"]
      const tableRows = tasks.map((task) => [
        task.batchTitle,
        task.currentProcess,
        `${task.completedDiamonds || 0}/${task.diamondNumber}`,
        task.status,
        new Date(task.dueDate).toLocaleDateString(),
        task.priority,
        `₹${task.earnings ? task.earnings.toLocaleString() : "0"}`,
      ])

      // Add table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [66, 139, 202] },
      })

      // Save PDF
      doc.save(`Task_History_${new Date().toLocaleDateString()}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  // Alternative export method using html2canvas
  const exportFullPageToPDF = async () => {
    if (!reportRef.current) return

    try {
      const content = reportRef.current
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 297 // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Task_History_${new Date().toLocaleDateString()}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Task History</h3>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Download size={16} />
          Export as PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-700">Task History</h3>
          <p className="text-sm text-gray-500">All assigned tasks and their status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diamonds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.batchTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.currentProcess}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.completedDiamonds || 0}/{task.diamondNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "Partially Completed"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{task.earnings ? task.earnings.toLocaleString() : "0"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Statistics Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-700 mb-2">Task Status Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completed:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.status === "Completed").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">In Progress:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.status === "In Progress").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.status === "Pending").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Partially Completed:</span>
              <span className="text-sm font-medium">
                {tasks.filter((t) => t.status === "Partially Completed").length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-700 mb-2">Priority Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">High Priority:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.priority === "High").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Medium Priority:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.priority === "Medium").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Low Priority:</span>
              <span className="text-sm font-medium">{tasks.filter((t) => t.priority === "Low").length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-700 mb-2">Diamond Processing</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Diamonds:</span>
              <span className="text-sm font-medium">{tasks.reduce((sum, task) => sum + task.diamondNumber, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completed Diamonds:</span>
              <span className="text-sm font-medium">
                {tasks.reduce((sum, task) => sum + (task.completedDiamonds || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completion Rate:</span>
              <span className="text-sm font-medium">
                {tasks.length > 0
                  ? Math.round(
                      (tasks.reduce((sum, task) => sum + (task.completedDiamonds || 0), 0) /
                        tasks.reduce((sum, task) => sum + task.diamondNumber, 0)) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskHistory
