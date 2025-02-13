import user from "../models/user.js";

// Create a new user as employee
export const createEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const checkUser = await user.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new user({ name, email, password, role });
    await newUser.save(); // Wait for the user to be saved
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await user.find({ role: "Employee" });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing Employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await user.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const updatedEmployee = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an existing employee
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await user.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await user.findByIdAndDelete(id); // Wait for the deletion
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
