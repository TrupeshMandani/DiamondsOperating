import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

const BatchCard = ({ batch }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {batch.batchName}
        </h3>
        <p className="text-sm text-muted-foreground">
          Created at: {new Date(batch.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="p-6">
        <h4 className="text-md font-semibold leading-none tracking-tight">
          Selected Processes:
        </h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {batch.selectedProcesses &&
            (Array.isArray(batch.selectedProcesses[0])
              ? batch.selectedProcesses.flat()
              : batch.selectedProcesses
            ).map((process) => {
              // Determine if this process is assigned
              const isAssigned =
                batch.progress &&
                batch.progress[process] !== undefined &&
                batch.progress[process] > 0;

              // Determine if this process is completed
              const isCompleted =
                batch.progress && batch.progress[process] === 100;

              return (
                <Badge
                  key={process}
                  className={`
                  ${
                    isCompleted
                      ? "bg-green-100 text-green-800"
                      : isAssigned
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }
                `}
                >
                  {process}
                  {isCompleted && <CheckCircle className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
        </div>
        <h4 className="text-md font-semibold leading-none tracking-tight mt-4">
          Batch Size: {batch.batchSize}
        </h4>
      </div>
    </div>
  );
};

export default BatchCard;
