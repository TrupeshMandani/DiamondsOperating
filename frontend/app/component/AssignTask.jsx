"use client";
import { useState } from "react";

const AssignTask = ({ employees = [], onAssign }) => {
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleAssignTask = () => {
    if (taskName && deadline && selectedEmployee) {
      onAssign({ id: Date.now(), taskName, deadline, assignedTo: selectedEmployee });
      setTaskName("");
      setDeadline("");
      setSelectedEmployee("");
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.name}>{emp.name}</option>
        ))}
      </select>
      
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      />
      
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-3 bg-[#003366] text-white rounded-lg outline-none"
      />
      
      <button
        className="w-full bg-[#0056A3] text-white px-4 py-3 rounded-lg hover:bg-[#004080] transition"
        onClick={handleAssignTask}
      >
        Assign Task
      </button>
    </div>
  );
};

export default AssignTask;
