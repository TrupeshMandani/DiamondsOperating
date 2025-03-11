// import { useState, useEffect } from "react";
// import EmpTaskCard from "./EmpTaskCard";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// const EmpTaskList = () => {
//   const [tasks, setTasks] = useState({
//     assigned: [],
//     inProgress: [],
//     completed: [],
//   });
//   const [assignedTasksToShow, setAssignedTasksToShow] = useState(4);
//   const [inProgressTasksToShow, setInProgressTasksToShow] = useState(4);
//   const [completedTasksToShow, setCompletedTasksToShow] = useState(4);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch tasks assigned to the employee
//   const fetchAssignedTasks = async () => {
//     try {
//       const employeeId = '67cfff1265d3ea526ee848f8'; // Get employee ID from local storage
//       const token = localStorage.getItem("authToken"); // Get token from local storage

//       if (!employeeId || !token) {
//         throw new Error("Employee ID or token not found. Please log in again.");
//       }

//       const response = await fetch(`http://localhost:5023/api/batches/tasks/employee/${employeeId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token for authentication
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch tasks: ${errorText}`);
//       }

//       const data = await response.json();

//       // Filter tasks based on status
//       setTasks({
//         assigned: data.filter(task => task.status === "Pending"), // Use "Pending" for assigned tasks
//         inProgress: data.filter(task => task.status === "In Progress"),
//         completed: data.filter(task => task.status === "Completed"),
//       });
//       setError(null); // Clear any previous errors
//     } catch (error) {
//       console.error("Error fetching tasks:", error.message);
//       setError("Failed to load tasks. Please try again later.");
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Fetch tasks when the component mounts
//   useEffect(() => {
//     fetchAssignedTasks();
//   }, []);

//   // Function to update the task status (e.g., move to in-progress or completed)
//   const handleChangeStatus = (taskId, toSection) => {
//     let task;
//     let fromSection;

//     for (const section in tasks) {
//       task = tasks[section].find((task) => task.id === taskId);
//       if (task) {
//         fromSection = section;
//         break;
//       }
//     }

//     if (task && fromSection) {
//       // Remove from current section
//       const newFromSection = tasks[fromSection].filter(
//         (task) => task.id !== taskId
//       );

//       // Add to the new section
//       const newToSection = [...tasks[toSection], task];

//       // Update the tasks state
//       setTasks((prevTasks) => ({
//         ...prevTasks,
//         [fromSection]: newFromSection,
//         [toSection]: newToSection,
//       }));
//     }
//   };

//   // Handle "See More" and "See Less" buttons
//   const handleSeeMore = (section) => {
//     if (section === "assigned") {
//       setAssignedTasksToShow(assignedTasksToShow + 4);
//     } else if (section === "inProgress") {
//       setInProgressTasksToShow(inProgressTasksToShow + 4);
//     } else if (section === "completed") {
//       setCompletedTasksToShow(completedTasksToShow + 4);
//     }
//   };

//   const handleSeeLess = (section) => {
//     if (section === "assigned") {
//       setAssignedTasksToShow(assignedTasksToShow - 4);
//     } else if (section === "inProgress") {
//       setInProgressTasksToShow(inProgressTasksToShow - 4);
//     } else if (section === "completed") {
//       setCompletedTasksToShow(completedTasksToShow - 4);
//     }
//   };

//   // Render task rows
//   const renderTaskRows = (taskList, status) => {
//     return taskList.map((task) => (
//       <EmpTaskCard
//         key={task._id}
//         task={task}
//         status={status}
//         batchTitle='BATCH-441114' // Ensure batchTitle is fetched
//         currentProcess={task.batchId?.currentProcess ?? "N/A"} // Ensure currentProcess is fetched
//         updateTaskStatus={(taskId, newStatus) => handleChangeStatus(taskId, newStatus)}
//       />
//     ));
//   };
   
  
  

//   // Check if "See More" button should be shown
//   const checkShowMoreButton = (section, tasksToShow) => {
//     if (section === "assigned") {
//       return tasksToShow < tasks.assigned.length;
//     } else if (section === "inProgress") {
//       return tasksToShow < tasks.inProgress.length;
//     } else if (section === "completed") {
//       return tasksToShow < tasks.completed.length;
//     }
//     return false;
//   };

//   // Check if "See Less" button should be shown
//   const checkShowLessButton = (section, tasksToShow) => {
//     return tasksToShow > 4;
//   };

//   // Display loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
//       </div>
//     );
//   }

//   // Display error message
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-red-500 text-center">
//           <p>{error}</p>
//           <button
//             onClick={fetchAssignedTasks}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto px-4">
//       {/* Assigned Tasks Section */}
//       <div className="w-full p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-xl font-semibold text-black text-center mb-6">
//           Assigned Tasks
//         </h2>
//         <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {renderTaskRows(
//             tasks.assigned.slice(0, assignedTasksToShow),
//             "assigned"
//           )}
//         </div>
//         <div className="flex justify-center mt-4 gap-4">
//           {checkShowMoreButton("assigned", assignedTasksToShow) && (
//             <button
//               onClick={() => handleSeeMore("assigned")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See More</span>
//               <IoIosArrowDown
//                 className="transform animate-bounce pt-1 text-xl"
//                 aria-label="See More"
//               />
//             </button>
//           )}
//           {checkShowLessButton("assigned", assignedTasksToShow) && (
//             <button
//               onClick={() => handleSeeLess("assigned")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See Less</span>
//               <IoIosArrowUp
//                 className="transform animate-bounce text-xl"
//                 aria-label="See Less"
//               />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* In Progress Tasks Section */}
//       <div className="w-full p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-xl font-semibold text-black text-center mb-6">
//           In Progress Tasks
//         </h2>
//         <div className="bg-white p-4 grid grid-cols-1  text-black sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {renderTaskRows(
//             tasks.inProgress.slice(0, inProgressTasksToShow),
//             "inProgress"
//           )}
//         </div>
//         <div className="flex justify-center mt-4 gap-4">
//           {checkShowMoreButton("inProgress", inProgressTasksToShow) && (
//             <button
//               onClick={() => handleSeeMore("inProgress")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See More</span>
//               <IoIosArrowDown
//                 className="transform animate-bounce pt-1 text-xl"
//                 aria-label="See More"
//               />
//             </button>
//           )}
//           {checkShowLessButton("inProgress", inProgressTasksToShow) && (
//             <button
//               onClick={() => handleSeeLess("inProgress")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See Less</span>
//               <IoIosArrowUp
//                 className="transform animate-bounce text-xl"
//                 aria-label="See Less"
//               />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Completed Tasks Section */}
//       <div className="w-full p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-xl font-semibold text-black text-center mb-6">
//           Completed Tasks
//         </h2>
//         <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {renderTaskRows(
//             tasks.completed.slice(0, completedTasksToShow),
//             "completed"
//           )}
//         </div>
//         <div className="flex justify-center mt-4 gap-4">
//           {checkShowMoreButton("completed", completedTasksToShow) && (
//             <button
//               onClick={() => handleSeeMore("completed")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See More</span>
//               <IoIosArrowDown
//                 className="transform animate-bounce pt-1 text-xl"
//                 aria-label="See More"
//               />
//             </button>
//           )}
//           {checkShowLessButton("completed", completedTasksToShow) && (
//             <button
//               onClick={() => handleSeeLess("completed")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
//             >
//               <span>See Less</span>
//               <IoIosArrowUp
//                 className="transform animate-bounce text-xl"
//                 aria-label="See Less"
//               />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmpTaskList;
import { useState, useEffect } from "react";
import EmpTaskCard from "./EmpTaskCard";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const EmpTaskList = () => {
  const [tasks, setTasks] = useState({ assigned: [], inProgress: [], completed: [] });
  const [taskLimits, setTaskLimits] = useState({ assigned: 4, inProgress: 4, completed: 4 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignedTasks = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const token = localStorage.getItem("authToken");

      if (!employeeId || !token) throw new Error("Employee ID or token not found. Please log in again.");

      const response = await fetch(`http://localhost:5023/api/batches/tasks/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch tasks: ${await response.text()}`);

      const data = await response.json();
      setTasks({
        assigned: data.filter(task => task.status === "Pending"),
        inProgress: data.filter(task => task.status === "In Progress"),
        completed: data.filter(task => task.status === "Completed"),
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignedTasks(); }, []);

  const handleTaskLimitChange = (section, increment) => {
    setTaskLimits(prev => ({ ...prev, [section]: prev[section] + (increment ? 4 : -4) }));
  };

  const renderTaskRows = (taskList, status) => (
    taskList.map(task => (
      <EmpTaskCard
        key={task._id}
        task={task}
        status={status}
        batchTitle="BATCH-441114"
        currentProcess={task.batchId?.currentProcess ?? "N/A"}
      />
    ))
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div></div>;

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-500 text-center">
        <p>{error}</p>
        <button onClick={fetchAssignedTasks} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {Object.keys(tasks).map(section => (
        <div key={section} className="w-full p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-black text-center mb-6">{section.replace(/([A-Z])/g, ' $1').trim()} Tasks</h2>
          <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderTaskRows(tasks[section].slice(0, taskLimits[section]), section)}
          </div>
          <div className="flex justify-center mt-4 gap-4">
            {taskLimits[section] < tasks[section].length && (
              <button onClick={() => handleTaskLimitChange(section, true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all">
                <span>See More</span> <IoIosArrowDown className="text-xl" />
              </button>
            )}
            {taskLimits[section] > 4 && (
              <button onClick={() => handleTaskLimitChange(section, false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all">
                <span>See Less</span> <IoIosArrowUp className="text-xl" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmpTaskList;
