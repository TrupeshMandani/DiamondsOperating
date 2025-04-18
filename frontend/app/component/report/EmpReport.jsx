"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const timeOptions = [
  { label: "All Time", value: 0 },
  { label: "Last 1 Month", value: 1 },
  { label: "Last 3 Months", value: 3 },
  { label: "Last 6 Months", value: 6 },
  { label: "Last 1 Year", value: 12 },
];

const EmployeeReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [timeFrame, setTimeFrame] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:5023/api/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
        if (data.length > 0) setSelectedEmpId(data[0]._id);
      } catch (err) {
        setError("Failed to load employees. Please try again later.");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmpId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://localhost:5023/api/employees/${selectedEmpId}/tasks`
        );
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();

        const completedTasks = data.filter(
          (task) =>
            task.status === "Completed" &&
            task.completedAt &&
            !isNaN(Date.parse(task.completedAt))
        );

        if (timeFrame === 0) {
          setTasks(completedTasks);
        } else {
          const now = new Date();
          const past = new Date();
          past.setMonth(now.getMonth() - timeFrame);

          const filtered = completedTasks.filter((task) => {
            const completedDate = new Date(task.completedAt);
            return completedDate >= past && completedDate <= now;
          });

          setTasks(filtered);
        }
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedEmpId, timeFrame]);

  const exportPDF = () => {
    const input = document.getElementById("employee-report-table");
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Employee_Report.pdf");
    });
  };

  const exportExcel = () => {
    if (!tasks.length) return;
    const ws = XLSX.utils.json_to_sheet(tasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Report");
    XLSX.writeFile(wb, "Employee_Report.xlsx");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Employee Task Report
      </h2>

      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Select Employee:
          </label>
          <select
            className="border border-gray-300 px-4 py-2 rounded w-60"
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
          >
            {employees.length > 0 ? (
              employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))
            ) : (
              <option disabled>No employees found</option>
            )}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Select Timeframe:
          </label>
          <select
            className="border border-gray-300 px-4 py-2 rounded w-60"
            value={timeFrame}
            onChange={(e) => setTimeFrame(Number(e.target.value))}
          >
            {timeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : error ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No data found for this timeframe.</p>
      ) : (
        <div
          id="employee-report-table"
          className="overflow-x-auto border rounded-md"
        >
          <table className="min-w-full bg-white border-collapse table-fixed text-sm">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="border px-4 py-2 text-left">Batch</th>
                <th className="border px-4 py-2 text-left">Process</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Priority</th>
                <th className="border px-4 py-2 text-left">Assigned</th>
                <th className="border px-4 py-2 text-left">Started</th>
                <th className="border px-4 py-2 text-left">Completed</th>
                <th className="border px-4 py-2 text-left">Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{task.batchTitle}</td>
                  <td className="border px-4 py-2">{task.currentProcess}</td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">{task.priority}</td>
                  <td className="border px-4 py-2">
                    {task.assignedDate
                      ? new Date(task.assignedDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {task.startTime
                      ? new Date(task.startTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {task.completedAt
                      ? new Date(task.completedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {task.durationInMinutes ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={exportPDF}
          className="bg-[#1a405e] hover:bg-[#001845] text-white px-6 py-2 rounded shadow"
          disabled={!tasks.length}
        >
          Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-[#236294] hover:bg-[#001845] text-white px-6 py-2 rounded shadow"
          disabled={!tasks.length}
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default EmployeeReport;