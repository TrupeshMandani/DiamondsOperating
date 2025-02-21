"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PerformanceChart from "../../component/PerformanceChart";

const PerformancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setEmployees([
      { id: 1, name: "John Doe", tasksCompleted: 30, efficiency: 85, hoursWorked: 120, completionRate: 90 },
      { id: 2, name: "Jane Smith", tasksCompleted: 25, efficiency: 78, hoursWorked: 110, completionRate: 85 },
    ]);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find(emp => emp.name === selectedEmployee);
      if (employee) {
        setPerformanceData([
          { name: "Tasks Completed", value: employee.tasksCompleted },
          { name: "Efficiency (%)", value: employee.efficiency },
          { name: "Hours Worked", value: employee.hoursWorked },
          { name: "Completion Rate (%)", value: employee.completionRate },
        ]);
      }
    }
  }, [selectedEmployee, employees]);

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#001F3F] to-[#002A5E]">
      <button
        className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080] mb-6"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Employee Performance</h1>

      <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-3">Select Employee</h2>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none mb-3"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.name}>{emp.name}</option>
          ))}
        </select>
        {selectedEmployee && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Performance Overview</h3>
            <PerformanceChart data={performanceData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
