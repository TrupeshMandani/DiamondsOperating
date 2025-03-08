import React from "react";

const EmployeeModal = ({
  isOpen,
  onClose,
  employees,
  setSelectedEmployee,
  handleBatchAssignment,
}) => {
  if (!isOpen) return null;

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee); // Set selected employee
    handleBatchAssignment(employee); // Call the parent function to assign batch
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Select an Employee</h2>
        <ul>
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="py-2 px-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectEmployee(employee)} // Handle employee selection
            >
              {employee.firstName} {employee.lastName}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
