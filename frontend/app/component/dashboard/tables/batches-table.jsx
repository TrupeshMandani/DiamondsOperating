"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

const BatchesTable = ({ batches, onViewDetails }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Process</TableHead>
            <TableHead>Total Diamonds</TableHead>
            <TableHead>Total Carats</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.batchId}>
              <TableCell className="font-medium">{batch.batchId}</TableCell>
              <TableCell>
                <Badge
                  variant={batch.status === "Active" ? "success" : batch.status === "Pending" ? "warning" : "default"}
                >
                  {batch.status}
                </Badge>
              </TableCell>
              <TableCell>{batch.currentProcess}</TableCell>
              <TableCell>{batch.totalDiamonds}</TableCell>
              <TableCell>{batch.totalCarats} ct</TableCell>
              <TableCell>{batch.assignedTo}</TableCell>
              <TableCell className="text-right">
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100"
                  onClick={() => onViewDetails(batch)}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BatchesTable

