import EmpDashboard from "@/app/component/EmpDashboard";
import ProtectedRoute from "@/app/component/ProtectedRoute";

import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        {" "}
        <EmpDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default page;
