"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Clock } from 'lucide-react'

const Box = ({ id, name, task, startTime, endTime, progress, isExpanded, onClick, onDelete }) => (
  <motion.div
    layoutId={`box-${id}`}
    onClick={() => onClick(id)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{ scale: isExpanded ? 1.5 : 1, zIndex: isExpanded ? 10 : 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer relative"
  >
    <h3 className="text-lg font-semibold mb-2 text-black">{name}</h3>
    <p className="mb-2 text-black"><strong>Task:</strong> {task}</p>
    <p className="mb-2 text-black">
      <Clock className="inline-block mr-1 text-gray-600" size={16} />
      <strong>Start:</strong> {startTime}
    </p>
    <p className="mb-2 text-black">
      <Clock className="inline-block mr-1 text-gray-600" size={16} />
      <strong>End:</strong> {endTime}
    </p>
    <div className="mb-2">
      <strong className="text-black">Progress:</strong>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete(id); }}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
    >
      <Trash2 size={20} />
    </button>
  </motion.div>
)

export default function EmployeeDashboard() {
  const [expandedId, setExpandedId] = useState(null)
  const [boxes, setBoxes] = useState([
    { id: 1, name: "John Doe", task: "Polishing Diamond D001", startTime: "09:00 AM", endTime: "11:00 AM", progress: 75 },
    { id: 2, name: "Jane Smith", task: "Cutting Diamond D002", startTime: "10:30 AM", endTime: "02:30 PM", progress: 40 },
    { id: 3, name: "Mike Johnson", task: "Grading Diamond D003", startTime: "08:00 AM", endTime: "12:00 PM", progress: 90 },
    { id: 4, name: "Emily Brown", task: "Cleaning Diamond D004", startTime: "11:00 AM", endTime: "01:00 PM", progress: 60 },
    { id: 5, name: "Chris Lee", task: "Inspecting Diamond D005", startTime: "02:00 PM", endTime: "04:00 PM", progress: 20 },
    { id: 6, name: "Sarah Wilson", task: "Packaging Diamond D006", startTime: "03:30 PM", endTime: "05:30 PM", progress: 5 },
  ])

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleDelete = (id) => {
    setBoxes(boxes.filter(box => box.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <Box
            key={box.id}
            {...box}
            isExpanded={expandedId === box.id}
            onClick={handleClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}