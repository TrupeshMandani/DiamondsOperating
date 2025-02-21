"use client";

import { useState, useEffect } from "react";
import AddEmployee from "../../component/AddEmployee";
import { useRouter } from "next/navigation";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setEmployees([
      { id: 1, name: "John Doe", role: "Software Engineer", department: "IT" },
      { id: 2, name: "Jane Smith", role: "HR Manager", department: "HR" },
    ]);
  }, []);

  const addEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setMessage("Employee added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteEmployee = (id) => {
    setEmployees((prevEmployees) => prevEmployees.filter(emp => emp.id !== id));
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#001F3F] to-[#002A5E]">
      <button
        className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080] mb-6"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Employee Management</h1>

      {/* Add Employee Form */}
      <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-3">Add New Employee</h2>
        <AddEmployee onAdd={addEmployee} />
        {message && <p className="text-green-400 text-center mt-2">{message}</p>}
      </div>

      {/* Employee List with Search and Delete */}
      <div className="max-w-lg mx-auto bg-[#002A4E] p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-3">Employee List</h2>
        <input
          type="text"
          placeholder="Search employee..."
          className="w-full p-2 rounded bg-[#003366] text-white mb-3"
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredEmployees.length > 0 ? (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Department</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b">
                  <td className="py-2">{emp.name}</td>
                  <td className="py-2">{emp.role}</td>
                  <td className="py-2">{emp.department}</td>
                  <td className="py-2 text-right">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
