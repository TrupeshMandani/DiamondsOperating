"use client"
import { motion, AnimatePresence } from "framer-motion"

const Modal = ({ isOpen, onClose, title, data }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1A405E] p-6 rounded-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-[#FCFCFC]">{title}</h2>
            <div className="max-h-96 overflow-y-auto">
              {Array.isArray(data) ? (
                data.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-[#236294] rounded">
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key} className="text-[#FCFCFC]">
                        <span className="font-semibold">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-[#FCFCFC]">{JSON.stringify(data)}</p>
              )}
            </div>
            <button
              className="mt-4 bg-[#236294] text-[#FCFCFC] px-4 py-2 rounded hover:bg-[#111827] transition-colors duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal


