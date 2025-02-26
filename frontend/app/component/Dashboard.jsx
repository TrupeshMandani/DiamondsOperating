// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import StatsCard from "./StatsCard";
// import Sidebar from "./Sidebar";
// import Modal from "./Modal";
// import { motion } from "framer-motion";

// const Dashboard = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalData, setModalData] = useState([]);

//   const [employees, setEmployees] = useState([]);
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [pendingTasks, setPendingTasks] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     setMounted(true);

//     // Simulate fetching data
//     setEmployees([
//       { id: 1, name: "John Doe", status: "Active" },
//       { id: 2, name: "Jane Smith", status: "Active" },
//       { id: 3, name: "Michael Johnson", status: "Active" },
//     ]);

//     setCompletedTasks([
//       { id: 1, task: "Complete Report", status: "Completed" },
//       { id: 2, task: "Approve Budget", status: "Completed" },
//     ]);

//     setPendingTasks([
//       { id: 3, task: "Review Code", status: "Pending" },
//       { id: 4, task: "Client Meeting", status: "Pending" },
//     ]);

//     setNotifications([
//       "New project assigned to John Doe",
//       "Meeting scheduled with CEO",
//       "Deadline reminder for Budget Approval",
//     ]);
//   }, []);

//   if (!mounted) {
//     return <div className="min-h-screen flex justify-center items-center bg-[#001F3F] text-white">Loading...</div>;
//   }

//   const openModal = (title, data) => {
//     setModalTitle(title);
//     setModalData(data);
//     setModalOpen(true);
//   };

//   return (
//     <div className="flex h-screen w-full">
//       <div className="w-72 h-screen fixed top-0 left-0 bg-[#002A5E] shadow-lg">
//         <Sidebar />
//       </div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex-1 ml-72 p-8 text-white bg-[#000F2A] overflow-y-auto"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Manager Dashboard</h1>
//           <button
//             className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080]"
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//           >
//             Toggle Theme
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//           <StatsCard title="Employees" value={employees.length} icon="Users" onClick={() => openModal("Total Employees", employees)} />
//           <StatsCard title="Completed Tasks" value={completedTasks.length} icon="CheckCircle" onClick={() => openModal("Completed Tasks", completedTasks)} />
//           <StatsCard title="Pending Tasks" value={pendingTasks.length} icon="ClipboardList" onClick={() => openModal("Pending Tasks", pendingTasks)} />
//           <StatsCard title="Notifications" value={notifications.length} icon="Bell" onClick={() => openModal("Notifications", notifications)} />
//         </div>

//         <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} data={modalData} />
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Task ID and Batch ID Generators
  const generateTaskId = () => `T${Math.floor(1000 + Math.random() * 9000)}`;
  const generateBatchId = () => `BATCH-${Math.floor(10000 + Math.random() * 90000)}`;

  // New Task Form State
  const [newTask, setNewTask] = useState({
    taskId: generateTaskId(),
    batchId: generateBatchId(),
    taskType: "",
    assignedTo: "",
    status: "Pending",
  });

  useEffect(() => {
    setMounted(true);

    // Dummy Employees
    setEmployees([
      { id: 1, name: "John Doe", tasksCompleted: 30, efficiency: 85, hoursWorked: 120 },
      { id: 2, name: "Jane Smith", tasksCompleted: 25, efficiency: 78, hoursWorked: 110 },
      { id: 3, name: "Michael Johnson", tasksCompleted: 40, efficiency: 90, hoursWorked: 140 },
    ]);

    // Dummy Tasks
    setTasks([
      { id: generateTaskId(), batchId: generateBatchId(), taskType: "Report Analysis", assignedTo: "John Doe", status: "Completed" },
      { id: generateTaskId(), batchId: generateBatchId(), taskType: "Budget Approval", assignedTo: "Jane Smith", status: "Pending" },
    ]);

    // Dummy Notifications
    setNotifications([
      "New project assigned to John Doe",
      "Meeting scheduled with CEO",
      "Deadline reminder for Budget Approval",
    ]);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex justify-center items-center bg-[#121828] text-white">Loading...</div>;
  }

  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setModalOpen(true);
  };

  // Get selected employee data
  const selectedEmployeeData = employees.find((emp) => emp.name === selectedEmployee) || {
    tasksCompleted: 0,
    efficiency: 0,
    hoursWorked: 0,
  };

  // Performance Pie Chart Data
  const performanceChartData = {
    labels: ["Tasks Completed", "Efficiency (%)", "Hours Worked"],
    datasets: [
      {
        label: "Performance Metrics",
        data: [
          selectedEmployeeData.tasksCompleted,
          selectedEmployeeData.efficiency,
          selectedEmployeeData.hoursWorked,
        ],
        backgroundColor: ["#111827", "#1A405E", "#236294"],
        borderWidth: 1,
      },
    ],
  };

  // Assign Task Function
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTask.taskType || !newTask.assignedTo) {
      alert("Please select all fields!");
      return;
    }

    setTasks([...tasks, newTask]);

    // Reset Form
    setNewTask({
      taskId: generateTaskId(),
      batchId: generateBatchId(),
      taskType: "",
      assignedTo: "",
      status: "Pending",
    });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#111827] text-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 text-[#121828] bg-[#f7f7f7] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#121828]">Manager Dashboard</h1>
          <button
            className="bg-[#111827] text-white px-4 py-2 rounded-lg hover:bg-[#0e1625] transition duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Toggle Theme
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <StatsCard title="Employees" value={employees.length} icon="Users" onClick={() => openModal("Total Employees", employees)} />
          <StatsCard title="Completed Tasks" value={tasks.filter((t) => t.status === "Completed").length} icon="CheckCircle" onClick={() => openModal("Completed Tasks", tasks)} />
          <StatsCard title="Pending Tasks" value={tasks.filter((t) => t.status === "Pending").length} icon="ClipboardList" onClick={() => openModal("Pending Tasks", tasks)} />
          <StatsCard title="Notifications" value={notifications.length} icon="Bell" onClick={() => openModal("Notifications", notifications)} />
        </div>

        {/* Employee Performance Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#111827]">Employee Performance Overview</h2>

          {/* Employee Dropdown */}
          <div className="mb-4">
            <label className="block text-lg mb-2 text-[#111827]">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border rounded-lg text-black bg-white shadow-sm hover:border-[#007BFF] transition duration-300"
            >
              <option value="">Select an Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Pie Chart */}
          {selectedEmployee && (
            <div className="mt-6 flex justify-center">
              <div className="w-80 h-80 bg-[#f7f7f7] p-4 rounded-lg shadow-md flex justify-center items-center">
                <Pie data={performanceChartData} />
              </div>
            </div>
          )}
        </div>

        {/* Assign Task Section */}
<div className="mt-8 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4 text-[#111827]">Assign Task</h2>
  <form onSubmit={handleAssignTask} className="grid grid-cols-2 gap-4">
    {/* Task ID */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Task ID</label>
      <input
        type="text"
        value={newTask.taskId}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600"
      />
    </div>

    {/* Batch ID */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Batch ID</label>
      <input
        type="text"
        value={newTask.batchId}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600"
      />
    </div>

    {/* Task Type & Assigned Employee in Single Row */}
    <div className="col-span-2 grid grid-cols-2 gap-4">
      {/* Task Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Type</label>
        <select
          value={newTask.taskType}
          onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value })}
          className="w-full p-2 border rounded-lg bg-white text-black focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Task Type</option>
          <option value="Sarin">Sarin</option>
          <option value="Stitching">Stitching</option>
          <option value="4P Cutting">4P Cutting</option>
        </select>
      </div>

      {/* Assigned Employee Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Assign To</label>
        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Centered Assign Task Button */}
    <div className="col-span-2 flex justify-center">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Assign Task
      </button>
    </div>
  </form>
</div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
