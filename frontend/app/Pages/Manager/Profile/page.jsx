"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ManagerProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // new email
  const [oldEmailInput, setOldEmailInput] = useState(""); // ✅ old email from input
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");

    if (storedName) setName(storedName);
    if (storedEmail) {
      setEmail(storedEmail);
      setOldEmailInput(storedEmail); // pre-fill old email input
    }
  }, []);

  const handleUpdate = async () => {
    if (!name || !email || !oldEmailInput) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      // Step 1: Update name/email
      const res = await fetch("http://localhost:5023/api/manager/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": oldEmailInput,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error updating profile: " + data.message);
        return;
      }

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      // Step 2: Update password if provided
      if (oldPassword && newPassword) {
        const resPass = await fetch("http://localhost:5023/api/auth/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: oldEmailInput,
            oldPassword,
            newPassword,
          }),
        });

        const dataPass = await resPass.json();
        if (!resPass.ok) {
          alert("Password update failed: " + dataPass.message);
          return;
        }
      }

      alert("Profile updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Manager Profile</h1>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          type="text"
          value={name}
          disabled={!isEditing}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Old Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Old Email</label>
        <Input
          type="email"
          value={oldEmailInput}
          disabled={!isEditing}
          onChange={(e) => setOldEmailInput(e.target.value)}
        />
      </div>

      {/* New Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">New Email</label>
        <Input
          type="email"
          value={email}
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Passwords */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Old Password</label>
        <Input
          type="password"
          value={oldPassword}
          disabled={!isEditing}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <Input
          type="password"
          value={newPassword}
          disabled={!isEditing}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="w-full">Edit Profile</Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/Pages/Manager/Dashboard")}>Back to Dashboard</Button>
          </>
        )}
      </div>
    </div>
  );
}
