"use client"

import React from "react"

const Progress = ({ value = 0, className = "", ...props }) => {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-500 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export { Progress }
