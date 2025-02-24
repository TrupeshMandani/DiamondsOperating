"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { Button } from "../component/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch employee data from backend on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5023/api/employee", {
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

  // Handle adding a new employee
  const handleAddEmployee = async () => {
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
      const response = await fetch("http://localhost:5023/api/employee", {
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
    } catch (error) {
      console.error("Error adding employee:", error);
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
    <div className="flex min-h-screen">
      <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-lg z-30">
        <Sidebar />
      </div>
      <main className="flex-1 ml-72 bg-[#f7f7f7]">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-black">
                    Employee Management
                  </h1>
                  <p className="text-gray-500">
                    Manage your team members and their roles
                  </p>
                </div>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new employee below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newEmployee.firstName}
                          required
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Last Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newEmployee.lastName}
                          required
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newEmployee.email}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={newEmployee.phoneNumber}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={newEmployee.address}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newEmployee.dateOfBirth}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-[#236294] text-white hover:bg-[#236294]/90"
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
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 text-black"
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
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                  >
                    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          Employee Details
                        </h2>
                        <button
                          onClick={() => setSelectedEmployee(null)}
                          className="text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Name:
                          </span>{" "}
                          {selectedEmployee.firstName}{" "}
                          {selectedEmployee.lastName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Email:
                          </span>{" "}
                          {selectedEmployee.email}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Phone:
                          </span>{" "}
                          {selectedEmployee.phoneNumber}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Address:
                          </span>{" "}
                          {selectedEmployee.address}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Date of Birth:
                          </span>{" "}
                          {selectedEmployee.dateOfBirth}
                        </p>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => setSelectedEmployee(null)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredEmployees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <Card className="bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="text-black size-max font-semibold">
                            {employee.firstName} {employee.lastName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500 mb-2">
                            Email: {employee.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Contact Number: {employee.phoneNumber}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-500 hover:text-blue-600"
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
