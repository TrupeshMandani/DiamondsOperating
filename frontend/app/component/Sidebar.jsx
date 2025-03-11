"use client";
import { RiDashboardLine } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { MdBatchPrediction } from "react-icons/md";
import { BsPersonVcardFill } from "react-icons/bs";
import { GrDocumentPerformance } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";

import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-54 bg-[#111827] text-white h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Manager Panel</h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <RiDashboardLine className="w-5 h-5" />
          <Link href="/Pages/Manager/Dashboard">Dashboard</Link>
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <FaTasks className="w-5 h-5" />
          <Link href="/Pages/Manager/Tasks">Tasks</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <MdBatchPrediction className="w-5 h-5" />
          <Link href="/Pages/Manager/Batches">Batches</Link>
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <BsPersonVcardFill className="w-5 h-5" />
          <Link href="/Pages/Manager/Employee">Employees</Link>
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <GrDocumentPerformance className="w-5 h-5" />
          <Link href="/performance">Performance</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
        <li className="flex items-center gap-3 p-2 rounded hover:bg-[#004080] cursor-pointer">
          <FaPlus className="w-5 h-5" />
          <Link href="/Pages/Manager/NewBatch">New Batch</Link>{" "}
          {/* ✅ Ensure correct link */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
