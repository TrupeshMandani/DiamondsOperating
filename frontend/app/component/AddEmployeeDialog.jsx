"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SKILLS_OPTIONS = [
  "Diamond Cutting",
  "Polishing",
  "Sarin Operator",
  "Stiching & Setting",
  "Quality Control",
  "Designing",
  "Logistics",
  "Customer Service",
  "Others",
];

export const AddEmployeeDialog = ({ isOpen, onClose, onAddEmployee }) => {
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    skills: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10}$/; // Assuming a 10-digit phone number
    return re.test(String(phoneNumber));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newEmployee.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!newEmployee.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!newEmployee.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(newEmployee.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!newEmployee.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(newEmployee.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format (10 digits)";
    }

    if (!newEmployee.address.trim()) newErrors.address = "Address is required";
    if (!newEmployee.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNewEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAddSkill = (skill) => {
    if (!newEmployee.skills.includes(skill)) {
      setNewEmployee((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const resetForm = () => {
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      skills: [],
    });
    setErrors({});
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      setFeedback({
        type: "error",
        message: "Please correct the errors in the form.",
      });
      return;
    }

    setIsSubmitting(true);

    const employeeData = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      dateOfBirth: new Date(newEmployee.dateOfBirth).toISOString(),
      email: newEmployee.email,
      phoneNumber: newEmployee.phoneNumber,
      address: newEmployee.address,
      skills: newEmployee.skills,
    };

    try {
      const response = await fetch(
        "https://diamondsoperating.onrender.com/api/employees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed: ${response.statusText}`);
      }

      const addedEmployee = await response.json();

      setFeedback({ type: "success", message: "Employee added successfully!" });
      onAddEmployee(addedEmployee);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to add employee",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px] bg-white rounded-xl border border-[#e2f0f9] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-[#f0f7ff] to-white">
          <DialogTitle className="text-[#1a2b42] text-xl font-semibold">
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-[#5a6a7e]">
            Enter the details of the new employee below
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 py-4">
          <div className="text-black grid gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-[#5a6a7e]">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={newEmployee.firstName}
                  className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-[#5a6a7e]">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={newEmployee.lastName}
                  className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[#5a6a7e]">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newEmployee.email}
                className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                  errors.email ? "border-red-500" : ""
                }`}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-[#5a6a7e]">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="Enter 10-digit phone number"
                value={newEmployee.phoneNumber}
                className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="text-[#5a6a7e]">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Enter address"
                value={newEmployee.address}
                className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                  errors.address ? "border-red-500" : ""
                }`}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth" className="text-[#5a6a7e]">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newEmployee.dateOfBirth}
                className={`border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ${
                  errors.dateOfBirth ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">
                  {errors.dateOfBirth}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills" className="text-[#5a6a7e]">
                Skills
              </Label>
              <Select onValueChange={handleAddSkill}>
                <SelectTrigger className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6] ">
                  <SelectValue placeholder="Select skills" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#e2f0f9] rounded-lg shadow-sm  text-black">
                  {SKILLS_OPTIONS.map((skill) => (
                    <SelectItem
                      key={skill}
                      value={skill}
                      disabled={newEmployee.skills.includes(skill)}
                    >
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {newEmployee.skills.length === 0 ? (
                  <p className="text-sm text-[#5a6a7e] italic">
                    No skills selected
                  </p>
                ) : (
                  newEmployee.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-[#e2f0f9] text-[#236294] hover:bg-[#d0e5f5]"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-500 focus:outline-none"
                        aria-label={`Remove ${skill} skill`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t border-[#e2f0f9] bg-[#f9fbfd]">
          <div className="flex justify-end gap-3 w-full">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Feedback Dialog */}
      <Dialog
        open={!!feedback.message}
        onOpenChange={() => setFeedback({ type: "", message: "" })}
      >
        <DialogContent className=" bg-white text-black sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {feedback.type === "error" ? "Error" : "Success"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">{feedback.message}</div>
          <DialogFooter>
            <Button onClick={() => setFeedback({ type: "", message: "" })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
