"use client";

import { useState } from "react";

const AddEmployee = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const handleAdd = () => {
    if (name && role && department) {
      onAdd({ id: Date.now(), name, role, department });
      setName("");
      setRole("");
      setDepartment("");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      />
      <button
        className="w-full bg-[#0056A3] text-white px-4 py-3 rounded-lg hover:bg-[#004080] transition"
        onClick={handleAdd}
      >
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployee;
