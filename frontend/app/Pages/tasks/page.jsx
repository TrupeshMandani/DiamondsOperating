"use client";

import { useState, useEffect } from "react";
import AssignTask from "../../component/AssignTask";
import TaskList from "../../component/TaskList";
import { useRouter } from "next/navigation";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setTasks([
      { id: 1, taskName: "Review Reports", assignedTo: "John Doe", status: "Pending" },
      { id: 2, taskName: "Approve Budget", assignedTo: "Jane Smith", status: "Completed" },
    ]);

    setEmployees([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Michael Johnson" },
    ]);
  }, []);

  const assignTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#001F3F] to-[#002A5E]">
      <button 
        className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080] mb-6"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Task Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assign Task Form */}
        <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Assign Task</h2>
          <AssignTask employees={employees} onAssign={assignTask} />
        </div>

        {/* Pending & Completed Tasks */}
        <div className="space-y-6">
          <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Pending Tasks</h2>
            <TaskList tasks={tasks} filter="pending" />
          </div>
          <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Completed Tasks</h2>
            <TaskList tasks={tasks} filter="completed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;