"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar  from "../../../component/Sidebar"; // Ensure Sidebar is already created
import axios from "axios";

// Function to generate random Batch ID
const generateBatchId = () => "BATCH-" + Math.floor(Math.random() * 1000000);

export default function BatchCreationForm() {
  const [formData, setFormData] = useState({
    batchId: generateBatchId(),
    materialType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    currentProcess: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, batchId: generateBatchId() }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      batchId: formData.batchId,
      materialType: formData.materialType,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerContact: {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      currentProcess: formData.currentProcess,
    };

    try {
      await axios.post("/api/batches", payload);
      toast.success("Batch Created Successfully!");
      console.log("Batch Data:", payload);

      // Reset form with new Batch ID
      setFormData({
        batchId: generateBatchId(),
        materialType: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        currentProcess: "",
      });
    } catch (error) {
      toast.error("Error Creating Batch!");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8 text-black">
        <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Create New Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Batch ID (Read-only) */}
              <div>
                <Label htmlFor="batchId">Batch ID</Label>
                <Input id="batchId" name="batchId" value={formData.batchId} readOnly className="bg-gray-200 cursor-not-allowed" />
              </div>

              {/* Material Type Dropdown */}
              <div>
                <Label htmlFor="materialType">Material Type</Label>
                <Select name="materialType" onValueChange={(value) => setFormData({ ...formData, materialType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Material Type" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    <SelectItem value="Rough Diamond">Rough Diamond</SelectItem>
                    <SelectItem value="Graphite Powder">Graphite Powder</SelectItem>
                    <SelectItem value="Diamond Paste">Diamond Paste</SelectItem>
                    <SelectItem value="Diamond Blades">Diamond Blades</SelectItem>
                    <SelectItem value="Cutting Fluids">Cutting Fluids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="text" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" placeholder="Enter address" value={formData.address} onChange={handleChange} required />
                </div>
              </div>

              {/* Process Selection Dropdown */}
              <div>
                <Label htmlFor="currentProcess">Current Process</Label>
                <Select name="currentProcess" onValueChange={(value) => setFormData({ ...formData, currentProcess: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Current Process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarin">Sarin</SelectItem>
                    <SelectItem value="Stitching">Stitching</SelectItem>
                    <SelectItem value="4P Cutting">4P Cutting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg">
                  Create Batch
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
