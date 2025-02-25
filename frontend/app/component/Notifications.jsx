"use client";
import { Bell } from "lucide-react";
import { useState } from "react";

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, message: "New task assigned to you", time: "2 mins ago" },
    { id: 2, message: "Employee performance updated", time: "1 hour ago" },
  ]);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 cursor-pointer" />
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {notifications.length}
      </div>
      <div className="absolute right-0 mt-2 w-64 bg-white] p-4 rounded shadow-md">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id} className="text-xs border-b border-gray-700 py-2">
              {notif.message} <span className="text-gray-400">({notif.time})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
