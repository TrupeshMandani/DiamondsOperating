import { useState } from "react";
import EmpTaskCard from "./EmpTaskCard";
import { IoIosArrowDown } from "react-icons/io";

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
  const [assignedTasksToShow, setAssignedTasksToShow] = useState(6);
  const [inProgressTasksToShow, setInProgressTasksToShow] = useState(6);
  const [completedTasksToShow, setCompletedTasksToShow] = useState(6);

  const handleSeeMore = (section) => {
    if (section === "assigned") {
      setAssignedTasksToShow(assignedTasksToShow + 6);
    } else if (section === "inProgress") {
      setInProgressTasksToShow(inProgressTasksToShow + 6);
    } else if (section === "completed") {
      setCompletedTasksToShow(completedTasksToShow + 6);
    }
  };

  const renderTaskRows = (taskList) => {
    return taskList.map((task) => (
      <EmpTaskCard key={task.id} task={task} status="assigned" />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Assigned Tasks Section */}
      <div className="w-full p-4 bg-[#fff] text-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold text-black text-center mb-4">
          Assigned Tasks
        </h2>
        <div className="bg-white p-5 flex flex-wrap gap-3 rounded-lg">
          {renderTaskRows(tasks.assigned.slice(0, assignedTasksToShow))}
        </div>
        {assignedTasksToShow < tasks.assigned.length && (
          <button
            onClick={() => handleSeeMore("assigned")}
            className="mt-4 mx-auto text-black hover:text-blue-600 text-lg flex items-center space-x-1"
          >
            <span>See More</span>
            <IoIosArrowDown
              className="transform animate-bounce pt-1 text-2xl"
              aria-label="See More"
            />
          </button>
        )}
      </div>

      {/* In Progress Tasks Section */}
      <div className="w-full p-4 bg-white text-white shadow-lg rounded-lg">
        <h2 className="text-lg text-black font-semibold text-center mb-4">
          In Progress Tasks
        </h2>
        <div className="bg-white p-3 flex flex-wrap gap-4 rounded-lg">
          {renderTaskRows(tasks.inProgress.slice(0, inProgressTasksToShow))}
        </div>
        {inProgressTasksToShow < tasks.inProgress.length && (
          <button
            onClick={() => handleSeeMore("inProgress")}
            className="mt-4 mx-auto text-black hover:text-blue-600 text-lg flex items-center space-x-1"
          >
            <span>See More</span>
            <IoIosArrowDown
              className="transform animate-bounce text-2xl"
              aria-label="See More"
            />
          </button>
        )}
      </div>

      {/* Completed Tasks Section */}
      <div className="w-full p-4 bg-[#fff] text-white shadow-lg rounded-lg">
        <h2 className="text-lg text-black font-semibold text-center mb-4">
          Completed Tasks
        </h2>
        <div className="bg-white p-3 flex flex-wrap gap-4 rounded-lg">
          {renderTaskRows(tasks.completed.slice(0, completedTasksToShow))}
        </div>
        {completedTasksToShow < tasks.completed.length && (
          <button
            onClick={() => handleSeeMore("completed")}
            className="mt-4 mx-auto text-black hover:text-blue-600 text-lg flex items-center space-x-1"
          >
            <span>See More</span>
            <IoIosArrowDown
              className="transform animate-bounce text-2xl"
              aria-label="See More"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default EmpTaskList;
