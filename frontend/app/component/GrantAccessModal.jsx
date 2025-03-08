// components/GrantAccessModal.jsx

'use client';
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const GrantAccessModal = ({ employee, onClose, onGrantAccess }) => {
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleGrantAccess = () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    onGrantAccess(employee, passwordData.password);
  };

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl border border-[#e2f0f9] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#1a2b42] text-xl">
            Grant Access to {employee?.firstName}
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
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#e2f0f9] text-[#5a6a7e] hover:bg-[#f0f7ff] hover:text-[#1a2b42]"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#4caf50] text-white hover:bg-[#43a047]"
            onClick={handleGrantAccess}
          >
            Grant Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};