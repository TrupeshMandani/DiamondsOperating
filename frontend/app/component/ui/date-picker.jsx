"use client"

import { useState } from "react"

export function DatePicker({ date, setDate }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date())

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)
    setSelectedDate(newDate)
    setDate(newDate)
  }

  return (
    <div>
      <input
        type="date"
        value={selectedDate.toISOString().split("T")[0]}
        onChange={handleDateChange}
        className="p-2 border rounded w-full text-black"
      />
    </div>
  )
}

