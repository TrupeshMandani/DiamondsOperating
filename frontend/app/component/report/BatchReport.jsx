"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

export default function BatchReport() {
  const [batchList, setBatchList] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchRecentBatches = async () => {
      const res = await fetch("http://localhost:5023/api/batches");
      const data = await res.json();
      const recent = data
        .sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate))
        .slice(0, 10);
      setBatchList(recent);
      if (recent.length > 0) {
        setSelectedBatchId(recent[0].batchId);
      }
    };
    fetchRecentBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;

    const fetchBatch = async () => {
      const res = await fetch(
        `http://localhost:5023/api/batches/${selectedBatchId}`
      );
      const data = await res.json();
      setBatchData(data);
    };

    const fetchTasks = async () => {
      const res = await fetch(
        `http://localhost:5023/api/tasks/title/${selectedBatchId}`
      );
      const taskData = await res.json();
      setTasks(taskData);
    };

    fetchBatch();
    fetchTasks();
  }, [selectedBatchId]);

  const exportPDF = () => {
    const input = document.getElementById("batch-report-table");
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Batch_Report.pdf");
    });
  };

  const exportExcel = () => {
    if (!batchData) return;
    const exportData = {
      ...batchData,
      currentProcess: batchData.currentProcess?.join(", "),
      completedProcesses: batchData.completedProcesses?.join(", "),
      assignedEmployees: batchData.assignedEmployees
        ?.map((emp) => `${emp.employeeId} – ${emp.process}`)
        .join(", "),
    };
    const ws = XLSX.utils.json_to_sheet([exportData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Batch Report");
    XLSX.writeFile(wb, "Batch_Report.xlsx");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Batch Report</h1>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Select a Batch:
        </label>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md w-72"
          value={selectedBatchId || ""}
          onChange={(e) => setSelectedBatchId(e.target.value)}
        >
          {batchList.map((batch) => (
            <option key={batch._id} value={batch.batchId}>
              {batch.batchId} –{" "}
              {new Date(batch.currentDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {batchData ? (
        <div id="batch-report-table" className="space-y-6">
          <div className="overflow-x-auto border rounded-lg bg-white shadow">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="border px-4 py-2 text-left">Batch ID</th>
                  <th className="border px-4 py-2 text-left">Material</th>
                  <th className="border px-4 py-2 text-left">Customer</th>
                  <th className="border px-4 py-2 text-left">Contact</th>
                  <th className="border px-4 py-2 text-left">Diamond</th>
                  <th className="border px-4 py-2 text-left">Dates</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Processes</th>
                  <th className="border px-4 py-2 text-left">Progress</th>
                  <th className="border px-4 py-2 text-left">Employees</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{batchData.batchId}</td>
                  <td className="border px-4 py-2">{batchData.materialType}</td>
                  <td className="border px-4 py-2">
                    {batchData.firstName} {batchData.lastName}
                  </td>
                  <td className="border px-4 py-2">
                    <div>{batchData.email}</div>
                    <div>{batchData.phone}</div>
                    <div>{batchData.address}</div>
                  </td>
                  <td className="border px-4 py-2">
                    {batchData.diamondWeight} ct
                    <br />
                    {batchData.diamondNumber} pcs
                  </td>
                  <td className="border px-4 py-2">
                    <div>
                      <strong>Start:</strong>{" "}
                      {new Date(batchData.currentDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Expected:</strong>{" "}
                      {new Date(batchData.expectedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="border px-4 py-2">{batchData.status}</td>
                  <td className="border px-4 py-2">
                    <div>
                      <strong>Current:</strong>{" "}
                      {batchData.currentProcess?.join(", ")}
                    </div>
                    <div>
                      <strong>Completed:</strong>{" "}
                      {batchData.completedProcesses?.join(", ")}
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    {Object.entries(batchData.progress || {}).map(
                      ([process, percent]) => (
                        <div key={process}>
                          {process}: {percent}%
                        </div>
                      )
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {batchData.assignedEmployees?.map((emp, i) => (
                      <div key={i}>
                        {emp.employeeId} – {emp.process}
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Task Details Section */}
          <div className="border rounded-lg bg-white shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Task Details
            </h2>
            {tasks.length === 0 ? (
              <p className="text-gray-600">
                No tasks available for this batch.
              </p>
            ) : (
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="border px-4 py-2 text-left">Process</th>
                    <th className="border px-4 py-2 text-left">Description</th>
                    <th className="border px-4 py-2 text-left">Employee</th>
                    <th className="border px-4 py-2 text-left">Assigned</th>
                    <th className="border px-4 py-2 text-left">Start</th>
                    <th className="border px-4 py-2 text-left">Complete</th>
                    <th className="border px-4 py-2 text-left">
                      Duration (min)
                    </th>
                    <th className="border px-4 py-2 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        {task.currentProcess}
                      </td>
                      <td className="border px-4 py-2">{task.description}</td>
                      <td className="border px-4 py-2">
                        {task.employeeId?.firstName} {task.employeeId?.lastName}
                      </td>
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
                      <td className="border px-4 py-2">{task.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading batch data...</p>
      )}
      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={exportPDF}
          className="bg-[#1a405e] hover:bg-[#001845] text-white px-6 py-2 rounded shadow"
        >
          Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-[#236294] hover:bg-[#001845] text-white px-6 py-2 rounded shadow"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
}