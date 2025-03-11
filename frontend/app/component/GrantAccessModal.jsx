"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const GrantAccessModal = ({ employee, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false); // Prevent multiple submissions

  if (!employee) return null;

  const handleGrantAccess = async () => {
    if (!passwordData.password || !passwordData.confirmPassword) {
      alert("Both password fields are required!");
      return;
    }

    if (passwordData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const registerData = {
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      password: passwordData.password,
    };

    try {
      setLoading(true); // Start loading state
      const response = await fetch("http://localhost:5023/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to register employee");
      }

      alert("Employee registered successfully!");
      onClose(); 
      setPasswordData({ password: "", confirmPassword: "" }); 
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl border border-[#e2f0f9] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1a2b42] text-xl">
            Grant Access to {employee.firstName}
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
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-[#5a6a7e]">Confirm Password</Label>
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
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#e2f0f9] text-[#5a6a7e] hover:bg-[#f0f7ff] hover:text-[#1a2b42]"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className={`bg-[#4caf50] text-white hover:bg-[#43a047] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleGrantAccess}
            disabled={loading}
          >
            {loading ? "Processing..." : "Grant Access"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
