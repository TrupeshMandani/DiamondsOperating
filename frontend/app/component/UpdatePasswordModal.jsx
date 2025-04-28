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

export const UpdatePasswordModal = ({ employee, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!employee) return null;

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://diamondsoperating.onrender.com/api/auth/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: employee.email,
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(onClose, 2000); // Close modal after success
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl border border-[#e2f0f9] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1a2b42] text-xl">
            Update Password for {employee.firstName}
          </DialogTitle>
        </DialogHeader>

        <div className="text-black grid gap-4 py-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="grid gap-2">
            <Label className="text-[#5a6a7e]">Old Password</Label>
            <Input
              type="password"
              placeholder="Enter old password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
              className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[#5a6a7e]">New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="border-[#e2f0f9] focus:border-[#64b5f6] focus:ring-[#64b5f6]"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[#5a6a7e]">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Confirm new password"
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
            className={`bg-[#4caf50] text-white hover:bg-[#43a047] ${
              loading || error ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpdatePassword}
            disabled={loading || error}
          >
            {loading ? "Processing..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
