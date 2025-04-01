"use client";
import React, { useState, useEffect } from "react";
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

  // Check token expiration and logout if expired
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("authToken");
      const expirationTime = localStorage.getItem("authTokenExpiration");

      if (token && expirationTime) {
        const currentTime = Date.now();
        if (currentTime > expirationTime) {
          console.log("Token expired. Logging out...");
          localStorage.removeItem("authToken");
          localStorage.removeItem("authTokenExpiration");
          router.push("/Pages/login"); // Redirect to login page
        }
      }
    };

    checkTokenExpiration();

    // Set a timeout to automatically remove the token after 5 minutes
    const tokenExpirationTimer = setTimeout(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authTokenExpiration");
      console.log("Token automatically removed after 5 minutes");
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup timeout if component unmounts or on rerender
    return () => clearTimeout(tokenExpirationTimer);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
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
      const { token, result } = data;
  
      // Decode token and get expiration time
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000; // Convert seconds to milliseconds
  
      // Store token, expiration, employee ID, and role in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authTokenExpiration", expirationTime);
      localStorage.setItem("employeeId", result._id);
      localStorage.setItem("role", decoded.role); // Store role
      localStorage.setItem("name", result.name); // Store name
  
      const userRole = decoded.role;
  
      setTimeout(() => {
        setIsSuccess(false);
        if (userRole === "Employee") {
          router.push("/Pages/employees/dashboard");
        } else if (userRole === "Manager" || userRole === "Admin") {
          router.push("/Pages/Manager/Dashboard");
        } else {
          router.push("/Pages/login");
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
