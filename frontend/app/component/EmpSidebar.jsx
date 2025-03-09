"use client";
import { Home, ClipboardList } from "lucide-react";
import Link from "next/link";
import { RiDashboardLine } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GrDocumentPerformance } from "react-icons/gr";
import { VscAccount } from "react-icons/vsc";

const EmpSidebar = () => {
  return (
    <div className="w-72 top-0 left-0 fixed bg-[#111827] text-white h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Welcome User</h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <RiDashboardLine className="w-5 h-5" />
          <Link href="/Pages/employees/dashboard">Dashboard</Link>
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <FaTasks className="w-5 h-5" />
          <Link href="/Pages/employees/task">Tasks</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <HiOutlineDocumentReport className="w-5 h-5" />
          <Link href="/Pages/employees/report">Report </Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <GrDocumentPerformance className="w-5 h-5" />
          <Link href="/Pages/employees/performance">Performance</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
      </ul>
      <div className="mt-auto">
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <VscAccount className="w-5 h-5" />
          <Link href="/Pages/employees/account">Account</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
      </div>
    </div>
  );
};

export default EmpSidebar;
