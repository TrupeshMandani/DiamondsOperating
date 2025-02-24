"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "../../../component/Sidebar"; // Ensure this is your existing Sidebar

export default function BatchCreationForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    materialType: "",
    batchSize: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Batch Created Successfully!");
    console.log("Batch Data:", formData);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar (Dark Blue) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl border text-black border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Create New Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Name */}
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact Info */}
              <div>
                <Label htmlFor="contactInfo">Contact Info</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  placeholder="Enter contact info"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Material Type */}
              <div>
                <Label htmlFor="materialType">Material Type</Label>
                <Input
                  id="materialType"
                  name="materialType"
                  type="text"
                  placeholder="Enter material type"
                  value={formData.materialType}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Batch Size */}
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  name="batchSize"
                  type="number"
                  placeholder="Enter batch size"
                  value={formData.batchSize}
                  onChange={handleChange}
                  required
                />
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
