"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Calendar, Pencil, Save } from "lucide-react";
import EmpSidebar from "@/app/component/EmpSidebar";

const EmpProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    skills: [],
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const id = localStorage.getItem("employeeId");
        if (!id) return console.error("Employee ID not found in localStorage.");

        const response = await axios.get(
          `http://localhost:5023/api/employees/id/${id}`
        );
        const data = response.data;

        setEmployee(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth || "",
          skills: data.skills || [],
        });
      } catch (error) {
        console.error("Failed to load employee data:", error);
      }
    };

    fetchEmployee();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const id = employee._id;
      await axios.put(`http://localhost:5023/api/employees/${id}`, form);

      setEmployee((prev) => ({ ...prev, ...form }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);
    }
  };

  if (!employee)
    return <div className="p-6 text-center">Loading employee data...</div>;

  const fullName = `${form.firstName} ${form.lastName}`;
  const formattedDOB = new Date(form.dateOfBirth).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4">
          <EmpSidebar />
        </div>

        <div className="flex-1">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <img
                src={"/placeholder.svg"}
                alt={fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#004080]"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="text-center md:text-left flex-1">
              {!isEditing ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#1A405E]">
                    {fullName}
                  </h1>
                </>
              ) : (
                <div className="flex gap-2">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-1/2"
                    placeholder="First Name"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-1/2"
                    placeholder="Last Name"
                  />
                </div>
              )}
              <p className="text-gray-600">Diamond Specialist • Operations</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start">
                <Calendar className="w-4 h-4 mr-1" />
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth?.split("T")[0]}
                    onChange={handleInputChange}
                    className="border p-1 rounded ml-1"
                  />
                ) : (
                  `Born on ${formattedDOB}`
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  ID: {employee._id}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#004080] text-white rounded hover:bg-[#003366]"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              {["overview", "documents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-[#004080] text-[#004080]"
                      : "text-gray-500 hover:text-[#004080]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {activeTab === "overview" && (
                <>
                  {/* Address */}
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                      Address
                    </h2>
                    {isEditing ? (
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <p className="text-gray-700">{employee.address}</p>
                    )}
                  </section>

                  {/* Skills */}
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                      Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === "documents" && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                    Documents
                  </h2>
                  <p className="text-gray-500">No documents available.</p>
                </section>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-[#1A405E]">
                  Contact Info
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <span className="text-gray-700">{employee.email}</span>
                    )}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <span className="text-gray-700">
                        {employee.phoneNumber}
                      </span>
                    )}
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{employee.address}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
