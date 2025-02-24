"use client";
import { Home, ClipboardList } from "lucide-react";
import Link from "next/link";


const Sidebar = () => {
  return (
    <div className="w-72 bg-[#002A5E] text-white h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Manager Panel</h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <Home className="w-5 h-5" />
          <Link href="/">Dashboard</Link>
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <ClipboardList className="w-5 h-5" />
          <Link href="/tasks">Tasks</Link> {/* ✅ Ensure correct link */}
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <ClipboardList className="w-5 h-5" />

          <Link href="/Employee">Employees</Link> 

        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <ClipboardList className="w-5 h-5" />
          <Link href="/performance">Performance</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
