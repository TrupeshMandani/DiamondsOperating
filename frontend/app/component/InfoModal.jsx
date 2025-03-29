import { useState } from "react";
import { ChevronDown } from "lucide-react";

const InfoModal = ({ isOpen, onClose, title, items }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (!isOpen) return null;

  const isEmployeeData =
    Array.isArray(items) &&
    items.length > 0 &&
    items[0].firstName !== undefined;

  const isTaskData =
    Array.isArray(items) &&
    items.length > 0 &&
    items[0].status !== undefined &&
    items[0].description !== undefined;

  const filterByDate = (task) => {
    const now = new Date();

    if (!task.completedAt) {
      return taskFilter === "all";
    }

    const taskDate = new Date(task.completedAt);
    const diffInMs = now - taskDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    switch (taskFilter) {
      case "today":
        return taskDate.toDateString() === now.toDateString();
      case "1day":
        return diffInMs <= 1000 * 60 * 60 * 24;
      case "1week":
        return diffInDays <= 7;
      case "1month":
        return diffInDays <= 30;
      default:
        return true;
    }
  };

  const filteredItems = isEmployeeData
    ? items.filter((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const email = emp.email?.toLowerCase();
        const skills = emp.skills?.join(" ").toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
          fullName.includes(search) ||
          email?.includes(search) ||
          skills?.includes(search)
        );
      })
    : isTaskData
    ? items.filter(filterByDate)
    : items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
          <h2 className="text-2xl font-semibold">{title}</h2>

          {isEmployeeData && (
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 text-sm w-full md:w-72"
            />
          )}

          {isTaskData && (
            <div className="relative">
              <select
                value={taskFilter}
                onChange={(e) => {
                  setTaskFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none border border-gray-300 rounded px-3 py-2 text-sm pr-8"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="1day">Last 24 Hours</option>
                <option value="1week">Last 7 Days</option>
                <option value="1month">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
          )}
        </div>

        {isEmployeeData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Address</th>
                  <th className="p-3 border">DOB</th>
                  <th className="p-3 border">Skills</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {paginatedItems.map((emp, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="p-3 border">{emp.firstName} {emp.lastName}</td>
                    <td className="p-3 border">{emp.email}</td>
                    <td className="p-3 border">{emp.phoneNumber}</td>
                    <td className="p-3 border">{emp.address || "N/A"}</td>
                    <td className="p-3 border">{emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : "N/A"}</td>
                    <td className="p-3 border">{emp.skills?.length > 0 ? emp.skills.join(", ") : "No skills"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : isTaskData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Employee</th>
                  <th className="p-3 border">Batch</th>
                  <th className="p-3 border">Due Date</th>
                  <th className="p-3 border">Completed At</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {paginatedItems.map((task, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="p-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border">{task.description}</td>
                    <td className="p-3 border">{task.status}</td>
                    <td className="p-3 border">{task.employeeId?.firstName} {task.employeeId?.lastName}</td>
                    <td className="p-3 border">{task.batchId?.batchId}</td>
                    <td className="p-3 border">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-3 border">{task.completedAt ? new Date(task.completedAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Message</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">
                        {item.employeeId && typeof item.employeeId === "object" && item.taskId ? (
                          <>
                            Task completed by employee:{" "}
                            <strong>{item.employeeId.firstName} {item.employeeId.lastName}</strong>{" "}
                            (Task ID: {item.taskId})
                          </>
                        ) : (
                          item.message || item
                        )}
                      </td>
                      <td className="p-3 border">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-3 border text-center">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
