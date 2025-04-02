"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ManagerProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch manager's profile data (e.g., from localStorage or an API)
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");

    if (storedName) {
      setName(storedName);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle profile update
  const handleUpdate = async () => {
    if (name === "") {
      alert("Please enter your name.");
      return;
    }

    // If you want to update profile information in the backend
    try {
      // Send updated name and email to the backend
      const res = await fetch("http://localhost:5023/api/manager/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
      } else {
        alert("Error updating profile: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Manager Profile</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          type="text"
          value={name}
          disabled={!isEditing}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="flex gap-4">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Back to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
