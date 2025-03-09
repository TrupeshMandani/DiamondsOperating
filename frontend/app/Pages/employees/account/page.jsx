"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BarChart2,
  Clock,
} from "lucide-react";

const EmpProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock employee data - replace with actual data from your API/database
  const employee = {
    id: "EMP-2023-001",
    name: "Alex Johnson",
    position: "Senior Developer",
    department: "Engineering",
    joinDate: "March 15, 2021",
    email: "alex.johnson@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "Experienced developer with a passion for creating efficient and scalable applications. Specializes in frontend development and UI/UX design.",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "UI/UX Design",
      "API Development",
    ],
    performance: {
      taskCompletion: 92,
      codeQuality: 88,
      teamCollaboration: 95,
      projectDelivery: 90,
    },
    recentActivity: [
      { date: "2 days ago", action: "Completed task: API Integration" },
      { date: "4 days ago", action: "Submitted code review for Project X" },
      { date: "1 week ago", action: "Completed quarterly performance review" },
      { date: "2 weeks ago", action: "Attended team training session" },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="relative">
          <img
            src={employee.avatar || "/placeholder.svg"}
            alt={employee.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#004080]"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A405E]">
            {employee.name}
          </h1>
          <p className="text-gray-600">
            {employee.position} • {employee.department}
          </p>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start">
            <Calendar className="w-4 h-4 mr-1" /> Joined {employee.joinDate}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Employee ID: {employee.id}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Active
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#004080] text-white rounded hover:bg-[#003366] transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {["overview", "performance", "tasks", "documents"].map((tab) => (
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

      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2">
          {activeTab === "overview" && (
            <>
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                  About
                </h2>
                <p className="text-gray-700">{employee.bio}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {employee.recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mt-1">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-700">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === "performance" && (
            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#1A405E]">
                Performance Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(employee.performance).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </h3>
                      <span className="font-bold text-[#004080]">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="bg-[#004080] h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-[#004080] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#1A405E]">
                      Performance Highlights
                    </h3>
                    <p className="text-gray-700 mt-1">
                      Alex has consistently exceeded expectations in team
                      collaboration and task completion. The next performance
                      review is scheduled for Q2 2025.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "tasks" && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                Current Tasks
              </h2>
              <p className="text-gray-500">Task details will appear here.</p>
            </section>
          )}

          {activeTab === "documents" && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[#1A405E]">
                Documents
              </h2>
              <p className="text-gray-500">
                Employee documents will appear here.
              </p>
            </section>
          )}
        </div>

        {/* Right Column - Contact Info */}
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#1A405E]">
              Contact Information
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{employee.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{employee.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{employee.location}</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#1A405E]">
              Performance Summary
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Overall Rating</span>
              <span className="font-bold text-[#004080]">91%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <motion.div
                className="bg-[#004080] h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "91%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-center">
              <BarChart2 className="w-6 h-6 text-[#004080]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
