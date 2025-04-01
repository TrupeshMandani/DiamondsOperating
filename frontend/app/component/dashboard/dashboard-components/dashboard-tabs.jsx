"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import BatchesTable from "../tables/batches-table"
import EmployeesTable from "../tables/employees-table"
import TasksTable from "../tables/tasks-table"

const DashboardTabs = ({ data }) => {
  const {
    paginatedBatches,
    employees,
    tasks,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    openBatchModal,
  } = data

  return (
    <Tabs defaultValue="batches" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="batches">Batches</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="batches" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Batches</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <BatchesTable batches={paginatedBatches} onViewDetails={openBatchModal} />
      </TabsContent>

      <TabsContent value="employees" className="space-y-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <EmployeesTable employees={employees} />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <TasksTable tasks={tasks} employees={employees} />
      </TabsContent>
    </Tabs>
  )
}

export default DashboardTabs

