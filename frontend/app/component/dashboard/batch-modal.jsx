"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const BatchModal = ({ batch, onClose }) => {
  if (!batch) return null

  // Calculate progress based on current process and completed processes
  const processes = ["Sarin", "Stitching", "4P Cutting"]
  const currentProcessIndex = processes.indexOf(batch.currentProcess)

  // Calculate overall progress
  let overallProgress = 0
  if (batch.progress) {
    const totalProgress = Object.values(batch.progress).reduce((sum, value) => sum + value, 0)
    overallProgress = Math.round((totalProgress / (processes.length * 100)) * 100)
  } else if (currentProcessIndex >= 0) {
    // Fallback if progress object is not available
    overallProgress = ((currentProcessIndex + 1) / processes.length) * 100
  }

  return (
    <Dialog open={true} onOpenChange={onClose} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Batch Details: {batch.batchId}</DialogTitle>
          <DialogDescription>Complete information about this diamond batch</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
              <Badge
                variant={
                  batch.status === "In Progress" || batch.status === "Assigned"
                    ? "success"
                    : batch.status === "Pending"
                      ? "warning"
                      : "default"
                }
              >
                {batch.status}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created On</h4>
              <p>{batch.createdDate}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Process</h4>
            <p className="font-medium">{batch.currentProcess}</p>
            <div className="mt-2">
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                {processes.map((process, index) => (
                  <span
                    key={process}
                    className={batch.completedProcesses?.includes(process) ? "text-green-500 font-medium" : ""}
                  >
                    {process}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Diamonds</h4>
              <p className="font-medium">{batch.totalDiamonds}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Carats</h4>
              <p className="font-medium">{batch.totalCarats} ct</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Material Type</h4>
              <p>{batch.source}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h4>
              <p>{batch.assignedTo}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
              <p>{batch.email}</p>
              <p>{batch.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Expected Completion</h4>
              <p>{batch.expectedDate}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
            <p className="text-sm">{batch.notes || "No notes available for this batch."}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Edit Batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BatchModal

