"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // To manage the loading state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get the token from localStorage

    if (!token) {
      // If no token, redirect to the login page
      router.push("/pages/login"); // Navigate to the login page
    } else {
      setLoading(false); // If token exists, stop loading
    }
  }, [router]);

  // If loading, show a loader or nothing until the redirect happens
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
