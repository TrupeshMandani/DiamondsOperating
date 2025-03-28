import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProcessFlow({ PROCESS_TYPES, selectedBatch, filteredTasks }) {
  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Process Flow</CardTitle>
        <CardDescription>Current batch processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {PROCESS_TYPES.map((process, index) => (
            <div key={`process-flow-${process}-${index}`} className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedBatch.currentProcess === process
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="text-lg font-bold">{index + 1}</span>
              </div>
              <span className="mt-2 text-sm font-medium">{process}</span>
              <div className="flex items-center mt-1">
                {filteredTasks.filter((t) => t.process === process).length > 0 ? (
                  <Badge className="bg-blue-100 text-blue-800">
                    {filteredTasks.filter((t) => t.process === process).length} tasks
                  </Badge>
                ) : (
                  <Badge variant="outline">No tasks</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-10"
            style={{
              width: `${((PROCESS_TYPES.indexOf(selectedBatch.currentProcess) + 0.5) * 100) / PROCESS_TYPES.length}%`,
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}

