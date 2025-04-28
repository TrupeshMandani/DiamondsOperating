"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UpdateEmployeeModal = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    email: employee.email || "",
    phoneNumber: employee.phoneNumber || "",
    address: employee.address || "",
    dateOfBirth: employee.dateOfBirth || "",
    skills: employee.skills || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateEmployee = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await fetch(
        `https://diamondsoperating.onrender.com/api/employees/${employee._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update employee");
      }

      setSuccess("Employee updated successfully!");
      setTimeout(onClose, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog key={employee._id} open={!!employee} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl border border-[#e2f0f9] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1a2b42] text-xl">
            Update Employee - {employee.firstName}
          </DialogTitle>
        </DialogHeader>

        <div className="text-black grid gap-4 py-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {Object.keys(formData).map((key) => (
            <div key={key} className="grid gap-2">
              <Label className="text-[#5a6a7e] capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </Label>
              <Input
                type="text"
                name={key}
                placeholder={`Enter ${key}`}
                value={formData[key]}
                onChange={handleInputChange}
                className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleUpdateEmployee}
          disabled={loading}
          className="bg-[#4caf50] text-white hover:bg-[#43a047]"
        >
          {loading ? "Updating..." : "Update Employee"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
