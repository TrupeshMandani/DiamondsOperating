"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const Box = ({ id, title, content, isExpanded, onClick }) => (
  <motion.div
    layoutId={`box-${id}`}
    onClick={() => onClick(id)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{ scale: isExpanded ? 1.5 : 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p>{content}</p>
  </motion.div>
)

export default function EmployeeDashboard() {
  const [expandedId, setExpandedId] = useState(null)

  const boxes = [
    { id: 1, title: "Current Task", content: "Polishing Diamond D001" },
    { id: 2, title: "Next Task", content: "Cutting Diamond D002" },
    { id: 3, title: "Completed Tasks", content: "5 tasks completed today" },
    { id: 4, title: "Productivity", content: "87% efficiency" },
    { id: 5, title: "Upcoming Schedule", content: "2 tasks scheduled for tomorrow" },
    { id: 6, title: "Notifications", content: "3 new messages" },
  ]

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <Box
            key={box.id}
            id={box.id}
            title={box.title}
            content={box.content}
            isExpanded={expandedId === box.id}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  )
}

