// components/EmployeeCard.jsx
import { motion } from "framer-motion";
import { Button } from "../component/ui/button";
import { FaTrash } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EmployeeCard = ({ employee, onViewDetails, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <Card className="bg-white shadow-md rounded-xl hover:shadow-xl transition-shadow duration-300 border border-[#e2f0f9] overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-[#236294]/5 to-[#64b5f6]/5 ">
          <div className="flex justify-between items-center ">
            <CardTitle className="text-[#1a2b42] font-semibold flex items-center ">
              <div className="flex-1 truncate">
                {employee.firstName} {employee.lastName}
              </div>
              <Button
                onClick={() => onDelete(employee._id)}
                className="bg-red-600 text-white hover:bg-red-700 rounded-full ml-10"
              >
                <FaTrash size={14} />
              </Button>
            </CardTitle>
          </div>
          <CardDescription className="text-[#5a6a7e]">
            Employee ID: {employee._id?.substring(0, 8) || "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-[#5a6a7e]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-[#64b5f6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center text-sm text-[#5a6a7e]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-[#64b5f6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{employee.phoneNumber}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-[#e2f0f9] bg-[#f8fbff] pt-3">
          <Button
            onClick={() => onViewDetails(employee)}
            className="w-full bg-[#236294]/10 text-[#236294] hover:bg-[#236294] hover:text-white transition-colors bg-blue-950"
            variant="outline"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};