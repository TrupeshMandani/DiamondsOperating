"use client";
import { useState } from "react";
import EmpTaskCard from "./EmpTaskCard";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const tasks = {
  assigned: [
    { id: "B001", start: "10:00 AM", end: "12:00 PM" },
    { id: "B002", start: "12:30 PM", end: "2:30 PM" },
    { id: "B003", start: "12:45 PM", end: "2:30 PM" },
    { id: "B004", start: "8:00 AM", end: "10:00 AM" },
    { id: "B005", start: "9:00 AM", end: "11:00 AM" },
    { id: "B006", start: "10:00 AM", end: "12:00 PM" },
    { id: "B007", start: "1:00 PM", end: "3:00 PM" },
  ],
  inProgress: [
    { id: "B003", start: "3:00 PM", end: "5:00 PM" },
    { id: "B008", start: "11:00 AM", end: "1:00 PM" },
    { id: "B009", start: "2:00 PM", end: "4:00 PM" },
  ],
  completed: [
    { id: "B004", start: "8:00 AM", end: "10:00 AM" },
    { id: "B005", start: "9:00 AM", end: "11:00 AM" },
  ],
};

const EmpTaskList = () => {
  const [assignedTasksToShow, setAssignedTasksToShow] = useState(4);
  const [inProgressTasksToShow, setInProgressTasksToShow] = useState(4);
  const [completedTasksToShow, setCompletedTasksToShow] = useState(4);

  const handleSeeMore = (section) => {
    if (section === "assigned") {
      setAssignedTasksToShow(assignedTasksToShow + 4);
    } else if (section === "inProgress") {
      setInProgressTasksToShow(inProgressTasksToShow + 4);
    } else if (section === "completed") {
      setCompletedTasksToShow(completedTasksToShow + 4);
    }
  };

  const handleSeeLess = (section) => {
    if (section === "assigned") {
      setAssignedTasksToShow(assignedTasksToShow - 4);
    } else if (section === "inProgress") {
      setInProgressTasksToShow(inProgressTasksToShow - 4);
    } else if (section === "completed") {
      setCompletedTasksToShow(completedTasksToShow - 4);
    }
  };

  const renderTaskRows = (taskList, status) => {
    return taskList.map((task) => (
      <EmpTaskCard key={task.id} task={task} status={status} />
    ));
  };

  const checkShowMoreButton = (section, tasksToShow) => {
    if (section === "assigned") {
      return tasksToShow < tasks.assigned.length;
    } else if (section === "inProgress") {
      return tasksToShow < tasks.inProgress.length;
    } else if (section === "completed") {
      return tasksToShow < tasks.completed.length;
    }
    return false;
  };

  const checkShowLessButton = (section, tasksToShow) => {
    return tasksToShow > 4;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Assigned Tasks Section */}
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-black text-center mb-6">
          Assigned Tasks
        </h2>
        <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderTaskRows(
            tasks.assigned.slice(0, assignedTasksToShow),
            "assigned"
          )}
        </div>
        <div className="flex justify-center mt-4 gap-4">
          {checkShowMoreButton("assigned", assignedTasksToShow) && (
            <button
              onClick={() => handleSeeMore("assigned")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See More</span>
              <IoIosArrowDown
                className="transform animate-bounce pt-1 text-xl"
                aria-label="See More"
              />
            </button>
          )}
          {checkShowLessButton("assigned", assignedTasksToShow) && (
            <button
              onClick={() => handleSeeLess("assigned")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See Less</span>
              <IoIosArrowUp
                className="transform animate-bounce text-xl"
                aria-label="See Less"
              />
            </button>
          )}
        </div>
      </div>

      {/* In Progress Tasks Section */}
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-black text-center mb-6">
          In Progress Tasks
        </h2>
        <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderTaskRows(
            tasks.inProgress.slice(0, inProgressTasksToShow),
            "inProgress"
          )}
        </div>
        <div className="flex justify-center mt-4 gap-4">
          {checkShowMoreButton("inProgress", inProgressTasksToShow) && (
            <button
              onClick={() => handleSeeMore("inProgress")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See More</span>
              <IoIosArrowDown
                className="transform animate-bounce pt-1 text-xl"
                aria-label="See More"
              />
            </button>
          )}
          {checkShowLessButton("inProgress", inProgressTasksToShow) && (
            <button
              onClick={() => handleSeeLess("inProgress")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See Less</span>
              <IoIosArrowUp
                className="transform animate-bounce text-xl"
                aria-label="See Less"
              />
            </button>
          )}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-black text-center mb-6">
          Completed Tasks
        </h2>
        <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderTaskRows(
            tasks.completed.slice(0, completedTasksToShow),
            "completed"
          )}
        </div>
        <div className="flex justify-center mt-4 gap-4">
          {checkShowMoreButton("completed", completedTasksToShow) && (
            <button
              onClick={() => handleSeeMore("completed")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See More</span>
              <IoIosArrowDown
                className="transform animate-bounce pt-1 text-xl"
                aria-label="See More"
              />
            </button>
          )}
          {checkShowLessButton("completed", completedTasksToShow) && (
            <button
              onClick={() => handleSeeLess("completed")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
            >
              <span>See Less</span>
              <IoIosArrowUp
                className="transform animate-bounce text-xl"
                aria-label="See Less"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpTaskList;
