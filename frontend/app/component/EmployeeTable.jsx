"use client";
import { useState } from "react";
import AddEmployee from "./AddEmployee";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Software Engineer", department: "IT" },
    { id: 2, name: "Jane Smith", role: "HR Manager", department: "HR" },
  ]);

  const addEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  return (
    <div className="bg-[#002A4E] p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Employee List</h2>
      
      {/* Add Employee Form */}
      <AddEmployee onAdd={addEmployee} />

      <table className="w-full text-left mt-4">
        <thead>
          <tr className="border-b border-gray-500">
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-gray-700">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.role}</td>
              <td className="p-2">{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
