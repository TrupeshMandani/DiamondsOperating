"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true); // State to toggle between login and signup

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:${process.env.PORT}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignup = async (e) => {
    // Logic to handle signup
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {isLoginForm ? "Login" : "Signup"}
      </h1>
      <div className="flex">
        <button
          className={`w-full bg-blue-500 text-white p-2 rounded mr-2 ${
            isLoginForm ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => setIsLoginForm(true)}
        >
          Login
        </button>
        <button
          className={`w-full bg-blue-500 text-white p-2 rounded ${
            !isLoginForm ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => setIsLoginForm(false)}
        >
          Signup
        </button>
      </div>

      {isLoginForm ? (
        <form className="w-80 space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Login
         </button>
        </form>
      ) : (
        <form className="w-80 space-y-4" onSubmit={handleSignup}>
          {/* Add signup form fields here */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            // Add value and onChange props
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            // Add value and onChange props
          />
          {/* Add more fields as needed */}
          <button className="w-full bg-green-500 text-white p-2 rounded">
            Signup
          </button>
        </form>
      )}
    </div>
  );
}
