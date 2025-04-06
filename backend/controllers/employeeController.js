import Employee from "../models/Employee.js"; // Import the Employee model
import Batch from "../models/batchModel.js";
// Create a new employee
export const createEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    dateOfBirth,
    skills,
  } = req.body;

  try {
    const checkEmployee = await Employee.findOne({ email });
    if (checkEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      skills: skills || [],
    });

    await newEmployee.save();

    res.status(200).json({
      message: "Employee registered successfully",
      employeeId: newEmployee._id, // Return the employee ID for authentication
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); // Get all employees from the Employee collection
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    dateOfBirth,
    skills,
  } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update only specific fields
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.address = address || employee.address;
    employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;
    employee.skills = skills || employee.skills;

    const updatedEmployee = await employee.save();

    res
      .status(200)
      .json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

// Delete an existing employee
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id); // Find employee in Employee collection
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await Employee.findByIdAndDelete(id); // Delete employee from Employee collection
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get batches assigned to a specific employee
export const getEmployeeBatches = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const batches = await Batch.find({ assignedEmployee: employeeId }); // Find batches assigned to employee by employeeId

    if (!batches.length) {
      return res
        .status(404)
        .json({ message: "No batches assigned to this employee" });
    }

    res.status(200).json(batches);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching batches", error: error.message });
  }
};
// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params; // Extract employee ID from the request parameters

  try {
    // Find employee by ID
    const employee = await Employee.findById(id);

    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return the employee details
    res.status(200).json(employee);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

// get emp by assigend tasks
export const getEmployeesWithAssignedBatches = async (req, res) => {
  try {
    // Fetch employees who have batches assigned to them
    const employees = await Employee.find({});

    // Initialize an empty array to hold the employee details and assigned batches
    const employeesWithAssignedBatches = [];

    // Iterate over each employee and fetch their assigned batches
    for (const employee of employees) {
      // Fetch batches assigned to the current employee
      const batches = await Batch.find({ assignedEmployee: employee._id });

      if (batches.length > 0) {
        // Add employee and their assigned batches to the array
        employeesWithAssignedBatches.push({
          employee: {
            id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
          },
          batches, // The batches assigned to this employee
        });
      }
    }

    if (employeesWithAssignedBatches.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees with assigned tasks found." });
    }

    // Send the list of employees and their assigned tasks
    res.status(200).json(employeesWithAssignedBatches);
  } catch (error) {
    console.error("Error fetching employees with assigned batches:", error);
    res.status(500).json({
      message: "Error fetching employees with assigned batches",
      error: error.message,
    });
  }
};
