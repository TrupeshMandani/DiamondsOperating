"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiLoader } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5023/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      setIsSuccess(true);
      const { token } = data;
      localStorage.setItem("authToken", token);

      // Decode the token immediately
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      setTimeout(() => {
        setIsSuccess(false);
        if (userRole === "Employee") {
          router.push("/pages/employees/dashboard");
        } else if (userRole === "Manager" || "Admin") {
          router.push("/pages/Manager/Dashboard");
        } else {
          router.push("/pages/login");
        }
      }, 500);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      <div
        className="p-8 rounded-xl backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20"
        style={{ width: "800px", height: "400px" }}
      >
        <div className="flex h-full">
          <div className="w-1/2 p-4 flex flex-col items-center justify-center bg-navy-800/50 backdrop-blur-sm rounded-xl border border-white/20">
            <img
              src="/Diamond logo.png"
              alt="Company Logo"
              className="w-24 h-24 rounded-full mb-4 backdrop-blur-sm border-2 border-white/30"
            />
            <h1 className="text-xl font-bold text-white">
              Diamond Management System
            </h1>
            <p className="text-center text-gray-300 text-sm mt-2">
              Secure access to your professional dashboard
            </p>
          </div>
          <div className="w-1/2 p-8 px-16 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-center text-white mb-6">
              Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-white/30 bg-white/20 px-3 py-2 rounded-md focus:outline-none focus:border-blue-400 placeholder-gray-400 text-white backdrop-blur-sm"
                />
              </div>
              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500/90 text-white px-4 py-2 rounded-md hover:bg-blue-600/90 transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : isSuccess ? (
                  <FiCheckCircle className="animate-pulse" />
                ) : (
                  <FiArrowRight />
                )}
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
