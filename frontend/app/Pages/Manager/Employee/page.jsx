"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import { Button } from "../../../component/ui/button";
import { FaTrash } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Color scheme
const colors = {
  primary: "#236294",
  primaryHover: "#1a4b70",
  secondary: "#e2f0f9",
  accent: "#64b5f6",
  background: "#f0f7ff",
  cardBg: "#ffffff",
  sidebar: "#121828",
  text: {
    primary: "#1a2b42",
    secondary: "#5a6a7e",
    light: "#8896a6",
  },
  success: "#4caf50",
  danger: "#f44336",
  warning: "#ff9800",
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Fix here
    address: "",
    dateOfBirth: "",
  });
  const [accessEmployee, setAccessEmployee] = useState(null);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch employee data from backend on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5023/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employees data");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleRegisterEmployee = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const registerData = {
      name: `${accessEmployee.firstName} ${accessEmployee.lastName}`,
      email: accessEmployee.email,
      password: passwordData.password,
    };

    try {
      const response = await fetch("http://localhost:5023/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) throw new Error("Failed to register employee");
      toast.success("Employee registered successfully!");
      alert("Employee registered successfully");
      setAccessEmployee(null);
      setPasswordData({ password: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle adding a new employee
  const handleAddEmployee = async () => {
    console.log("button clicked ");
    if (
      !newEmployee.firstName ||
      !newEmployee.lastName ||
      !newEmployee.email ||
      !newEmployee.phoneNumber ||
      !newEmployee.address ||
      !newEmployee.dateOfBirth
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employeeData = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      dateOfBirth: new Date(newEmployee.dateOfBirth).toISOString(),
      email: newEmployee.email,
      phoneNumber: newEmployee.phoneNumber,
      address: newEmployee.address,
    };

    try {
      console.log("Sending data:", employeeData);
      const response = await fetch("http://localhost:5023/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
      });
      setIsAddDialogOpen(false);
      toast.success("Employee added successfully");
      alert("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5023/api/employees/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees(employees.filter((employee) => employee._id !== id));
      alert("Employee deleted successfully");
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f0f7ff]">
      <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-lg z-30">
        <Sidebar />
      </div>
      <main className="flex-1 ml-72 bg-[#f0f7ff] min-h-screen">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#1a2b42]">
                    Employee Management
                  </h1>
                  <p className="text-[#5a6a7e] mt-1">
                    Manage your team members and their roles
                  </p>
                </div>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#236294] text-white hover:bg-[#1a4b70] transition-colors shadow-md">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border border-[#e2f0f9]">
                    <DialogHeader>
                      <DialogTitle className="text-[#1a2b42] text-xl">
                        Add New Employee
                      </DialogTitle>
                      <DialogDescription className="text-[#5a6a7e]">
                        Enter the details of the new employee below
                      </DialogDescription>
                    </DialogHeader>
                    <div className=" text-black grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName" className="text-[#5a6a7e]">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={newEmployee.firstName}
                            required
                            className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName" className="text-[#5a6a7e]">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={newEmployee.lastName}
                            required
                            className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                            onChange={(e) =>
                              setNewEmployee({
                                ...newEmployee,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#5a6a7e]">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newEmployee.email}
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-[#5a6a7e]">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={newEmployee.phoneNumber}
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address" className="text-[#5a6a7e]">
                          Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={newEmployee.address}
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth" className="text-[#5a6a7e]">
                          Date of Birth
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newEmployee.dateOfBirth}
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="border-[#e2f0f9] text-[#5a6a7e] hover:bg-[#f0f7ff] hover:text-[#1a2b42]"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-[#236294] text-white hover:bg-[#1a4b70]"
                        onClick={handleAddEmployee}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {!selectedEmployee && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5a6a7e]" />
                    <Input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 border border-[#e2f0f9] bg-white text-[#1a2b42] rounded-lg shadow-sm focus:ring-2 focus:ring-[#64b5f6] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {selectedEmployee && (
                <AnimatePresence>
                  <motion.div
                    layoutId="modal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
                  >
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6 border border-[#e2f0f9]">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#1a2b42]">
                          Employee Details
                        </h2>
                        <button
                          onClick={() => setSelectedEmployee(null)}
                          className="text-[#5a6a7e] hover:text-[#1a2b42] transition duration-200 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#f0f7ff]"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-4 bg-[#f8fbff] p-4 rounded-lg border border-[#e2f0f9]">
                        <div className="flex items-center pb-3 border-b border-[#e2f0f9]">
                          <div className="h-12 w-12 rounded-full bg-[#236294] text-white flex items-center justify-center text-xl font-semibold mr-4">
                            {selectedEmployee.firstName?.[0]}
                            {selectedEmployee.lastName?.[0]}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-[#1a2b42]">
                              {selectedEmployee.firstName}{" "}
                              {selectedEmployee.lastName}
                            </h3>
                            <p className="text-[#5a6a7e] text-sm">Employee</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-start">
                            <div className="w-24 text-[#5a6a7e] text-sm">
                              Email:
                            </div>
                            <div className="text-[#1a2b42] font-medium">
                              {selectedEmployee.email}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-24 text-[#5a6a7e] text-sm">
                              Phone:
                            </div>
                            <div className="text-[#1a2b42] font-medium">
                              {selectedEmployee.phoneNumber}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-24 text-[#5a6a7e] text-sm">
                              Address:
                            </div>
                            <div className="text-[#1a2b42] font-medium">
                              {selectedEmployee.address}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-24 text-[#5a6a7e] text-sm">
                              Birth Date:
                            </div>
                            <div className="text-[#1a2b42] font-medium">
                              {new Date(
                                selectedEmployee.dateOfBirth
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6 pt-4 border-t border-[#e2f0f9]">
                        <Button
                          onClick={() => setAccessEmployee(selectedEmployee)}
                          className="px-4 py-2 bg-[#64b5f6] text-white rounded-lg hover:bg-[#4a9fe0] transition duration-200 shadow-sm"
                        >
                          Add Access
                        </Button>
                        <Button
                          onClick={() => setSelectedEmployee(null)}
                          className="px-4 py-2 bg-[#236294] text-white rounded-lg hover:bg-[#1a4b70] transition duration-200 shadow-sm"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {accessEmployee && (
                <Dialog
                  open={!!accessEmployee}
                  onOpenChange={() => setAccessEmployee(null)}
                >
                  <DialogContent className="bg-white rounded-xl border  border-[#e2f0f9] shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-[#1a2b42] text-xl">
                        Grant Access to {accessEmployee.firstName}
                      </DialogTitle>
                      <DialogDescription className="text-[#5a6a7e]">
                        Create login credentials for this employee
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-black grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label className="text-[#5a6a7e]">Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={passwordData.password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              password: e.target.value,
                            })
                          }
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[#5a6a7e]">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setAccessEmployee(null)}
                        className="border-[#e2f0f9] text-[#5a6a7e] hover:bg-[#f0f7ff] hover:text-[#1a2b42]"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-[#4caf50] text-white hover:bg-[#43a047]"
                        onClick={handleRegisterEmployee}
                      >
                        Grant Access
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredEmployees.map((employee, index) => (
                    <motion.div
                      key={employee.id || index}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      layout
                    >
                      <Card className="bg-white shadow-md rounded-xl hover:shadow-xl transition-shadow duration-300 border border-[#e2f0f9] overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-[#236294]/5 to-[#64b5f6]/5">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-[#1a2b42] font-semibold flex items-center">
                              <div className="flex-1 truncate">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <Button
                                onClick={() =>
                                  handleDeleteEmployee(employee._id)
                                }
                                className="bg-red-600 text-white hover:bg-red-700 rounded-full  ml-10"
                              >
                                <FaTrash size={14} />
                              </Button>
                            </CardTitle>
                          </div>
                          <CardDescription className="text-[#5a6a7e]">
                            Employee ID:{" "}
                            {employee._id?.substring(0, 8) || "N/A"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-[#5a6a7e]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-[#64b5f6]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="truncate">{employee.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-[#5a6a7e]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-[#64b5f6]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span>{employee.phoneNumber}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-[#e2f0f9] bg-[#f8fbff] pt-3">
                          <Button
                            onClick={() => setSelectedEmployee(employee)}
                            className="w-full bg-[#236294]/10 text-[#236294] hover:bg-[#236294] hover:text-white transition-colors"
                            variant="outline"
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
