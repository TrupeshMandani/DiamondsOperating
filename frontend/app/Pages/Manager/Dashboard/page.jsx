"use client";

import AuthProtection from "../../../../utils/AuthProtection";
import Dashboard from "../../../component/dashboard/dashboard";

function Manager() {
  return (
    <AuthProtection>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-4">
        <Dashboard />
      </div>
    </AuthProtection>
  );
}

export default Manager;

