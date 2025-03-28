"use client";

import AuthProtection from "@/utils/AuthProtection";
import Dashboard from "../../../component/Dashboard";

function Manager() {
  return (
    <AuthProtection>
      <div className="min-h-screen bg-[#001F3F] text-white">
        <Dashboard />
      </div>
    </AuthProtection>
  );
}

export default Manager;
