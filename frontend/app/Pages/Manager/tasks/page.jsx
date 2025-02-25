"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic"; // Lazy load Sidebar
import axios from "axios";
import { debounce } from "lodash";

// Lazy Load Sidebar
const Sidebar = dynamic(() => import("../../../component/Sidebar"), { ssr: false });

// Function to generate random Batch ID
const generateBatchId = () => "BATCH-" + Math.floor(Math.random() * 1000000);

export default function BatchCreationForm() {
  const [loading, setLoading] = useState(false);
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

  // Debounced Input Change Handler
  const handleChange = useCallback(
    debounce((e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, 300),
    []
  );

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

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
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Common Input Fields
  const inputFields = [
    { id: "firstName", placeholder: "Enter first name", type: "text" },
    { id: "lastName", placeholder: "Enter last name", type: "text" },
    { id: "email", placeholder: "Enter email", type: "email" },
    { id: "phone", placeholder: "Enter phone number", type: "text" },
    { id: "address", placeholder: "Enter address", type: "text" },
  ];

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

              {/* Customer Information Fields */}
              <div className="grid grid-cols-2 gap-4">
                {inputFields.slice(0, 2).map(({ id, placeholder, type }) => (
                  <div key={id}>
                    <Label htmlFor={id}>{id.replace(/([A-Z])/g, " $1")}</Label>
                    <Input id={id} name={id} type={type} placeholder={placeholder} value={formData[id]} onChange={handleChange} required />
                  </div>
                ))}
              </div>

              {/* Contact Information Fields */}
              <div className="grid grid-cols-3 gap-4">
                {inputFields.slice(2).map(({ id, placeholder, type }) => (
                  <div key={id}>
                    <Label htmlFor={id}>{id.replace(/([A-Z])/g, " $1")}</Label>
                    <Input id={id} name={id} type={type} placeholder={placeholder} value={formData[id]} onChange={handleChange} required />
                  </div>
                ))}
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
                <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg" disabled={loading}>
                  {loading ? "Creating..." : "Create Batch"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
