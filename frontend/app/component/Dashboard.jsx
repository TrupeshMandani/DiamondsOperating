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

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setMounted(true);

    // Simulate fetching data
    setEmployees([
      { id: 1, name: "John Doe", status: "Active" },
      { id: 2, name: "Jane Smith", status: "Active" },
      { id: 3, name: "Michael Johnson", status: "Active" },
    ]);

    setCompletedTasks([
      { id: 1, task: "Complete Report", status: "Completed" },
      { id: 2, task: "Approve Budget", status: "Completed" },
    ]);

    setPendingTasks([
      { id: 3, task: "Review Code", status: "Pending" },
      { id: 4, task: "Client Meeting", status: "Pending" },
    ]);

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

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 text-[#121828] bg-[#f7f7f7] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#121828]">Dashboard</h1>
          <button
            className="bg-[#121828] text-white px-4 py-2 rounded hover:bg-[#0e1625]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Toggle Theme
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatsCard
            title="Employees"
            value={employees.length}
            icon="Users"
            onClick={() => openModal("Total Employees", employees)}
          />
          <StatsCard
            title="Completed Tasks"
            value={completedTasks.length}
            icon="CheckCircle"
            onClick={() => openModal("Completed Tasks", completedTasks)}
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon="ClipboardList"
            onClick={() => openModal("Pending Tasks", pendingTasks)}
          />
          <StatsCard
            title="Notifications"
            value={notifications.length}
            icon="Bell"
            onClick={() => openModal("Notifications", notifications)}
          />
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} data={modalData} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
