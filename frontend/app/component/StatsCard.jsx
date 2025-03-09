"use client";

import { Users, CheckCircle, ClipboardList, Bell } from "lucide-react";

const iconComponents = {
  Users,
  CheckCircle,
  ClipboardList,
  Bell,
};

const StatsCard = ({ title, value, icon, onClick }) => {
  const IconComponent = iconComponents[icon];

  return (
    <div
      className="bg-white border-black p-6 rounded-lg shadow-md text-center cursor-pointer hover:bg-slate-300"
      onClick={onClick} // Make card clickable
    >
      <IconComponent className=" border-black w-10 h-10 mx-auto text-black mb-2" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
