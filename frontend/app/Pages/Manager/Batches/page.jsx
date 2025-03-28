import Sidebar from "@/app/component/Sidebar"; // Import Sidebar component
import TaskAssignment from "../../../component/task-assignment/task-assignment";
import Batch from "../../../component/Batch";

function Manager() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-800 text-white">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-4">
        {" "}
        {/* Adding left margin to accommodate the fixed sidebar */}
        <div className="flex flex-col gap-4">
          {/* Batch Component - Placed above TaskAssignment */}
          <div className="w-full">
            <Batch />
          </div>

          {/* TaskAssignment Component */}
          <div className="w-full">
            <TaskAssignment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manager;
