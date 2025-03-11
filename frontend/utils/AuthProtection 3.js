"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Install with: npm install jwt-decode

const AuthProtection = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/Pages/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      console.log("User Role:", userRole, "Current Path:", pathname); // Debugging

      // Define valid paths for each role
      const rolePaths = {
        Manager: "/Pages/Manager/Dashboard",
        Employee: "/Pages/employees/dashboard",
        Admin: "/Pages/Manager/Dashboard",
      };

      const allowedPath = rolePaths[userRole];

      if (!allowedPath) {
        // If role is invalid, clear storage and redirect to login
        localStorage.removeItem("authToken");
        router.replace("/Pages/login");
      } else if (pathname !== allowedPath) {
        // Redirect user to their assigned dashboard if they try accessing another one
        router.replace(allowedPath);
      }
    } catch (error) {
      console.error("Invalid Token:", error);
      localStorage.removeItem("authToken");
      router.replace("/Pages/login");
    }
  }, [router, pathname]);

  return children;
};

export default AuthProtection;
