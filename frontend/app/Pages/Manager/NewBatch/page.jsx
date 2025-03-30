"use client";
import axios from "axios"; // Add this import statement

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "../../../component/Sidebar";
import { useRouter } from "next/navigation"; // Correct usage of useRouter

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
    diamondWeight: "",
    numOfDiamonds: "",
    expectedDate: "",
    currentDate: new Date().toISOString().split("T")[0],
  });

  const router = useRouter(); // Correctly using useRouter directly inside the component
  const [selectedProcesses, setSelectedProcesses] = useState([]);

  const handleChangeProcess = (e) => {
    const { value, checked } = e.target;
    setSelectedProcesses((prev) =>
      checked ? [...prev, value] : prev.filter((process) => process !== value)
    );
  };

  useEffect(() => {
    // Regenerate a new Batch ID on mount
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
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      diamondWeight: formData.diamondWeight,
      diamondNumber: formData.numOfDiamonds,
      expectedDate: formData.expectedDate,
      currentDate: formData.currentDate,
      currentProcess: selectedProcesses, // Updated to include multiple processes
      processStartDate: new Date().toISOString(),
      status: "Pending",
      progress: selectedProcesses.reduce((acc, process) => {
        acc[process] = 0;
        return acc;
      }, {}),
    };

    try {
      const response = await axios.post(
        "http://localhost:5023/api/batches/create",
        payload
      );
      toast.success("Batch Created Successfully!");
      alert("Batch Created successfully");
    } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      toast.error("Error Creating Batch!");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8 text-black">
        <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Create New Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    readOnly
                    className="bg-gray-200 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="materialType">Material Type</Label>
                  <Select
                    name="materialType"
                    value={formData.materialType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, materialType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Material Type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 text-black bg-white">
                      <SelectItem value="Rough Diamond">
                        Rough Diamond
                      </SelectItem>
                      <SelectItem value="Graphite Powder">
                        Graphite Powder
                      </SelectItem>
                      <SelectItem value="Diamond Paste">
                        Diamond Paste
                      </SelectItem>
                      <SelectItem value="Diamond Blades">
                        Diamond Blades
                      </SelectItem>
                      <SelectItem value="Cutting Fluids">
                        Cutting Fluids
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email, Phone, Address */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Current Process */}
              <div>
                <Label
                  htmlFor="processes"
                  className="text-lg font-semibold text-gray-700"
                >
                  Processes to be Done
                </Label>
                <div className="flex items-center space-x-8 mt-4">
                  {/* Sarin Process */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="Sarin"
                      name="processes"
                      value="Sarin"
                      onChange={handleChangeProcess}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="Sarin" className="text-gray-600">
                      Sarin
                    </Label>
                  </div>
                  {/* Connector Line */}
                  <div className="h-1 w-16 bg-gray-300"></div>
                  {/* Stitching Process */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="Stitching"
                      name="processes"
                      value="Stitching"
                      onChange={handleChangeProcess}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="Stitching" className="text-gray-600">
                      Stitching
                    </Label>
                  </div>
                  {/* Connector Line */}
                  <div className="h-1 w-16 bg-gray-300"></div>
                  {/* 4P Cutting Process */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="4P Cutting"
                      name="processes"
                      value="4P Cutting"
                      onChange={handleChangeProcess}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <Label htmlFor="4P Cutting" className="text-gray-600">
                      4P Cutting
                    </Label>
                  </div>
                </div>
              </div>

              {/* Diamond Weight & Number of Diamonds */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diamondWeight">Diamond Weight (Carat)</Label>
                  <Input
                    id="diamondWeight"
                    name="diamondWeight"
                    type="number"
                    placeholder="Enter weight"
                    value={formData.diamondWeight}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numOfDiamonds">Number of Diamonds</Label>
                  <Input
                    id="numOfDiamonds"
                    name="numOfDiamonds"
                    type="number"
                    placeholder="Enter number"
                    value={formData.numOfDiamonds}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Expected Date & Current Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedDate">Expected Date</Label>
                  <Input
                    id="expectedDate"
                    name="expectedDate"
                    type="date"
                    value={formData.expectedDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentDate">Current Date</Label>
                  <Input
                    id="currentDate"
                    name="currentDate"
                    type="date"
                    value={formData.currentDate}
                    readOnly
                    className="bg-gray-200 cursor-not-allowed"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg"
                >
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
