// components/AddEmployeeDialog.jsx
'use client';
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../component/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const AddEmployeeDialog = ({ isOpen, onClose, onAddEmployee }) => {
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

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
      const response = await fetch("http://localhost:5023/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

      const addedEmployee = await response.json();
      onAddEmployee(addedEmployee); // Pass the new employee back to the parent
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
      });
      onClose(); // Close the dialog
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border border-[#e2f0f9]">
        <DialogHeader>
          <DialogTitle className="text-[#1a2b42] text-xl">
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-[#5a6a7e]">
            Enter the details of the new employee below
          </DialogDescription>
        </DialogHeader>
        <div className="text-black grid gap-4 py-4">
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
            onClick={onClose}
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
  );
};