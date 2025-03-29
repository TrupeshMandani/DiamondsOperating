import EmpDashboard from "@/app/component/EmpDashboard";
import AuthProtection from "@/utils/AuthProtection";
import React from "react";

const page = () => {
  return (
    <AuthProtection>
      <div>
        <EmpDashboard />
      </div>
    </AuthProtection>
  );
};

export default page;
