"use client";
import { useState, useEffect } from "react";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch(
          "https://diamondsoperating.onrender.com/api/batches/employees/assigned"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchAssignedTasks();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task, index) => (
        <div
          key={task._id || index}
          className="bg-white shadow-md p-4 rounded-lg"
        >
          <h2 className="text-lg font-semibold">Batch ID: {task.batchId}</h2>
          <p className="text-gray-600">
            Employee: {task.assignedEmployee?.firstName}{" "}
            {task.assignedEmployee?.lastName}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
