"use client"

import { useRef } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Download } from "lucide-react"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const EarningsReport = ({ earningsData, selectedMonth, monthlyEarnings, yearlyEarnings, onMonthChange }) => {
  const reportRef = useRef(null)

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

  // Handle month change
  const handleMonthChange = (event) => {
    onMonthChange(Number(event.target.value))
  }

  // Export to PDF function
  const exportToPDF = async () => {
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
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Earnings_Report_${new Date().toLocaleDateString()}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>

        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Download size={16} />
          Export as PDF
        </button>
      </div>

      <div ref={reportRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Earnings</h3>
            <p className="text-4xl font-bold mb-2">₹{monthlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500">
              {new Date(new Date().setMonth(selectedMonth - 1)).toLocaleString("default", { month: "long" })}{" "}
              {new Date().getFullYear()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Yearly Earnings</h3>
            <p className="text-4xl font-bold mb-2">₹{yearlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Calendar Year {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Earnings Trend</h3>
          <div className="h-80">
            <Bar
              data={prepareEarningsChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: `Monthly Earnings for ${new Date().getFullYear()}`,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Earnings Summary</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earningsData && earningsData.length > 0 ? (
                earningsData
                  .sort((a, b) => a.month - b.month)
                  .map((entry, index) => (
                    <tr key={index} className={selectedMonth === entry.month ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(0, entry.month - 1).toLocaleString("default", { month: "long" })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{entry.totalEarnings.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No earnings data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EarningsReport
