// components/EmployeeDetailsModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../component/ui/button";
import { X } from "lucide-react";

export const EmployeeDetailsModal = ({ employee, onClose, onGrantAccess }) => {
  return (
    <AnimatePresence>
      <motion.div
        layoutId="modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6 border border-[#e2f0f9]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#1a2b42]">
              Employee Details
            </h2>
            <button
              onClick={onClose}
              className="text-[#5a6a7e] hover:text-[#1a2b42] transition duration-200 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#f0f7ff]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 bg-[#f8fbff] p-4 rounded-lg border border-[#e2f0f9]">
            <div className="flex items-center pb-3 border-b border-[#e2f0f9]">
              <div className="h-12 w-12 rounded-full bg-[#236294] text-white flex items-center justify-center text-xl font-semibold mr-4">
                {employee.firstName?.[0]}
                {employee.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1a2b42]">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-[#5a6a7e] text-sm">Employee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start">
                <div className="w-24 text-[#5a6a7e] text-sm">Email:</div>
                <div className="text-[#1a2b42] font-medium">
                  {employee.email}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-[#5a6a7e] text-sm">Phone:</div>
                <div className="text-[#1a2b42] font-medium">
                  {employee.phoneNumber}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-[#5a6a7e] text-sm">Address:</div>
                <div className="text-[#1a2b42] font-medium">
                  {employee.address}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-[#5a6a7e] text-sm">Birth Date:</div>
                <div className="text-[#1a2b42] font-medium">
                  {new Date(employee.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-[#5a6a7e] text-sm">Skills:</div>
                <div className="text-[#1a2b42] font-medium">
                  {employee.skills}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-[#e2f0f9]">
            <Button
              onClick={() => onGrantAccess(employee)}
              className="px-4 py-2 bg-[#64b5f6] text-white rounded-lg hover:bg-[#4a9fe0] transition duration-200 shadow-sm"
            >
              Add Access
            </Button>
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-[#236294] text-white rounded-lg hover:bg-[#1a4b70] transition duration-200 shadow-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};