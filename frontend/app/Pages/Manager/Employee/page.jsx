"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserPlus } from "lucide-react";
import { alert } from "sonner";
import { Button } from "../../../component/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeCard } from "../../../component/EmployeeCard";
import dynamic from "next/dynamic";
import Sidebar from "@/app/component/Sidebar";

// Dynamically import modals to reduce initial load time and use default exports correctly
const EmployeeDetailsModalDynamic = dynamic(
  () =>
    import("../../../component/EmployeeDetailsModal").then(
      (mod) => mod.EmployeeDetailsModal
    ),
  { ssr: false }
);
const GrantAccessModalDynamic = dynamic(
  () =>
    import("../../../component/GrantAccessModal").then(
      (mod) => mod.GrantAccessModal
    ),
  { ssr: false }
);
const AddEmployeeDialogDynamic = dynamic(
  () =>
    import("../../../component/AddEmployeeDialog").then(
      (mod) => mod.AddEmployeeDialog
    ),
  { ssr: false }
);

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [accessEmployee, setAccessEmployee] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
        alert.error(error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  const handleDeleteEmployee = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!isConfirmed) return;

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

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );
      alert.success("Employee deleted successfully");
    } catch (error) {
      alert.error(`Error: ${error.message}`);
    }
  };

  // Memoize filtered employees to avoid recalculating on every render
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <div className="flex min-h-screen bg-[#f0f7]">
      <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-lg z-30">
        <Sidebar />
      </div>
      <main className="flex-1 ml-72 bg-gray-50 min-h-screen">
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
                  <AddEmployeeDialogDynamic
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onAddEmployee={handleAddEmployee}
                  />
                </Dialog>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee._id}
                      employee={employee}
                      onViewDetails={setSelectedEmployee}
                      onDelete={handleDeleteEmployee}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedEmployee && (
        <EmployeeDetailsModalDynamic
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onGrantAccess={setAccessEmployee}
        />
      )}

      {accessEmployee && (
        <GrantAccessModalDynamic
          employee={accessEmployee}
          onClose={() => setAccessEmployee(null)}
          onGrantAccess={(employee, password) => {
            // Handle grant access logic here
            console.log("Granting access to:", employee, password);
          }}
        />
      )}
    </div>
  );
}
