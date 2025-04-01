"use client"

import React from "react"

const ChartContainer = ({ children, config = {}, className = "", ...props }) => {
  // Set CSS variables for chart colors
  React.useEffect(() => {
    const root = document.documentElement

    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        root.style.setProperty(`--color-${key}`, value.color)
      }
    })

    return () => {
      // Clean up CSS variables
      Object.keys(config).forEach((key) => {
        root.style.removeProperty(`--color-${key}`)
      })
    }
  }, [config])

  return (
    <div className={`w-full h-full ${className}`} {...props}>
      {children}
    </div>
  )
}

const ChartTooltipContent = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-1 space-y-0.5">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center text-xs">
            <span className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.name}: </span>
            <span className="ml-1">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltipContent }

