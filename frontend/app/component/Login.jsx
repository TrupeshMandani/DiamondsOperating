"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-slate-300 fixed inset-0 flex items-center justify-center">
      <motion.div
        className="p-8 bg-white rounded-md shadow-lg shadow-white-500 flex  justify-center"
        style={{ width: "800px", height: "400px" }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-1/2 bg-gray-200 p-4 flex flex-col items-center justify-center">
          {/* Company info and image */}
          <img
            src="/public/images/logo.png"
            alt="Company Logo"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="text-xl font-bold">Diamond Management System</h1>
          <p className="text-center text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nisl vitae ultricies rhoncus,
          </p>
        </div>
        <motion.div
          className="w-1/2  p-8 px-16 flex flex-col items-center justify-center"
          key={isSignup ? "signup" : "login"} // Key for animation based on login/signup
          initial={{ opacity: 0, x: isSignup ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-center">
            {isSignup ? "Signup" : "Login"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {isSignup && (
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline mt-4 block text-center"
          >
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginForm;
