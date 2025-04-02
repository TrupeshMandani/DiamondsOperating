"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { RiDashboardLine } from "react-icons/ri"
import { FaTasks, FaPlus } from "react-icons/fa"
import { MdBatchPrediction } from "react-icons/md"
import { BsPersonVcardFill } from "react-icons/bs"
import { GrDocumentPerformance } from "react-icons/gr"
import { FiLogOut } from "react-icons/fi"
import { Diamond, ChevronDown, User } from "lucide-react"

const Sidebar = () => {
  const pathname = usePathname()
  const [batchesOpen, setBatchesOpen] = useState(false)
  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {
    const storedName = localStorage.getItem("name")
    if (storedName) setName(storedName)
  }, [])

  const isActive = (path) => pathname === path

  const handleLogout = () => {
    localStorage.clear()
    router.push("/Pages/login")
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-2 rounded-lg shadow-lg">
            <Diamond className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
            Manager Panel
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/Pages/Manager/Dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/Pages/Manager/Dashboard")
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                  : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-md ${isActive("/Pages/Manager/Dashboard") ? "bg-white/20" : "bg-gray-800"}`}>
                <RiDashboardLine className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/Pages/Manager/Tasks"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/Pages/Manager/Tasks")
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                  : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-md ${isActive("/Pages/Manager/Tasks") ? "bg-white/20" : "bg-gray-800"}`}>
                <FaTasks className="w-4 h-4" />
              </div>
              <span>Tasks</span>
            </Link>
          </li>

          {/* Dropdown for Batches */}
          <li className="relative">
            <button
              onClick={() => setBatchesOpen(!batchesOpen)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/Pages/Manager/Batches") || isActive("/Pages/Manager/NewBatch")
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                  : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md ${
                    isActive("/Pages/Manager/Batches") || isActive("/Pages/Manager/NewBatch")
                      ? "bg-white/20"
                      : "bg-gray-800"
                  }`}
                >
                  <MdBatchPrediction className="w-4 h-4" />
                </div>
                <span>Batches</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${batchesOpen ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ${
                batchesOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="pl-12 mt-2 space-y-2">
                <li>
                  <Link
                    href="/Pages/Manager/Batches"
                    className={`block py-2 px-3 rounded-md transition-colors ${
                      isActive("/Pages/Manager/Batches")
                        ? "bg-blue-700/50 text-white"
                        : "text-gray-400 hover:text-white hover:bg-blue-800/20"
                    }`}
                  >
                    All Batches
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Pages/Manager/NewBatch"
                    className={`block py-2 px-3 rounded-md transition-colors ${
                      isActive("/Pages/Manager/NewBatch")
                        ? "bg-blue-700/50 text-white"
                        : "text-gray-400 hover:text-white hover:bg-blue-800/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaPlus className="w-3 h-3" />
                      <span>New Batch</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link
              href="/Pages/Manager/Employee"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/Pages/Manager/Employee")
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                  : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-md ${isActive("/Pages/Manager/Employee") ? "bg-white/20" : "bg-gray-800"}`}>
                <BsPersonVcardFill className="w-4 h-4" />
              </div>
              <span>Employees</span>
            </Link>
          </li>

          <li>
            <Link
              href="/performance"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/performance")
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md"
                  : "text-gray-300 hover:bg-blue-800/30 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-md ${isActive("/performance") ? "bg-white/20" : "bg-gray-800"}`}>
                <GrDocumentPerformance className="w-4 h-4 text-white" />
              </div>
              <span>Performance</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* ✅ Manager Profile Link */}
      <div className="mt-auto border-t border-blue-900/30 p-4">
        <Link
          href="/Pages/Manager/Profile"
          className="flex items-center gap-3 mb-4 p-3 bg-blue-900/20 rounded-lg hover:bg-blue-800/30 transition"
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1e293b]" />
          </div>
          <div>
            <p className="font-medium text-sm">{name || "Manager"}</p>
            <p className="text-xs text-gray-400">Profile</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-900/30 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-md bg-red-900/30">
            <FiLogOut className="w-4 h-4" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
