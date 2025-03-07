"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Dashboard from "../../../component/Dashboard";
import ProtectedRoute from "@/app/component/ProtectedRoute";

function Manager() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#001F3F] text-white">
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}

export default Manager;
