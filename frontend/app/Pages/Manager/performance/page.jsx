"use client";

import AuthProtection from "../../../../utils/AuthProtection";
import performance from "../../../component/performance";

function Manager() {
  return (
    <AuthProtection>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-4">
        <performance />
      </div>
    </AuthProtection>
  );
}

export default Manager;
