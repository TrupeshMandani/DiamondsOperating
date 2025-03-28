"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import BatchCard from "./batch-card"
import { categorizeBatches } from "./utils"

export default function BatchTabs({ batches, onSelectBatch, socket }) {
  const [categorizedBatches, setCategorizedBatches] = useState({
    notAssigned: [],
    inProgress: [],
    assigned: [],
    completed: [],
  })

  // Categorize batches whenever the batches prop changes
  useEffect(() => {
    if (batches && batches.length > 0) {
      setCategorizedBatches(categorizeBatches(batches))
    }
  }, [batches])

  // Listen for real-time batch updates
  useEffect(() => {
    if (!socket) return

    const handleBatchUpdate = (updatedBatch) => {
      // Re-categorize all batches when one is updated
      setCategorizedBatches((prevCategorized) => {
        // Find all batches from all categories
        const allBatches = [
          ...prevCategorized.notAssigned,
          ...prevCategorized.inProgress,
          ...prevCategorized.assigned,
          ...prevCategorized.completed,
        ]

        // Update the specific batch
        const updatedBatches = allBatches.map((batch) =>
          batch.batchId === updatedBatch.batchId ? { ...batch, ...updatedBatch } : batch,
        )

        // Re-categorize all batches
        return categorizeBatches(updatedBatches)
      })
    }

    socket.on("batchUpdated", handleBatchUpdate)
    socket.on("taskAssigned", () => {
      // When a task is assigned, we should refetch all batches
      // This is a simplified approach - in a real app, you might want to be more selective
      if (batches && batches.length > 0) {
        setCategorizedBatches(categorizeBatches(batches))
      }
    })

    return () => {
      socket.off("batchUpdated", handleBatchUpdate)
      socket.off("taskAssigned")
    }
  }, [socket, batches])

  return (
    <div className="w-full">
      <Tabs defaultValue="inProgress" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="notAssigned" className="relative">
            Not Assigned
            <Badge className="ml-2 bg-gray-200 text-gray-800">{categorizedBatches.notAssigned.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="relative">
            In Progress
            <Badge className="ml-2 bg-yellow-200 text-yellow-800">{categorizedBatches.inProgress.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned" className="relative">
            Assigned
            <Badge className="ml-2 bg-blue-200 text-blue-800">{categorizedBatches.assigned.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <Badge className="ml-2 bg-green-200 text-green-800">{categorizedBatches.completed.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Not Assigned Tab */}
        <TabsContent value="notAssigned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.notAssigned.length > 0 ? (
              categorizedBatches.notAssigned.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard batch={batch} onSelect={onSelectBatch} category="notAssigned" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No batches without assignments</div>
            )}
          </div>
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="inProgress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.inProgress.length > 0 ? (
              categorizedBatches.inProgress.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard batch={batch} onSelect={onSelectBatch} category="inProgress" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No batches in progress</div>
            )}
          </div>
        </TabsContent>

        {/* Assigned Tab */}
        <TabsContent value="assigned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.assigned.length > 0 ? (
              categorizedBatches.assigned.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard batch={batch} onSelect={onSelectBatch} category="assigned" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No fully assigned batches</div>
            )}
          </div>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.completed.length > 0 ? (
              categorizedBatches.completed.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard batch={batch} onSelect={onSelectBatch} category="completed" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No completed batches</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

