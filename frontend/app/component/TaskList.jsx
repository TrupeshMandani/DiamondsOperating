"use client";

const TaskList = ({ tasks = [], filter }) => {
  if (!Array.isArray(tasks)) {
    console.error("Error: tasks is not an array", tasks);
    return <p className="text-red-500">Error: Task data is missing or invalid.</p>;
  }

  const filteredTasks = tasks.filter((task) =>
    filter === "completed" ? task.status === "Completed" : task.status === "Pending"
  );

  return (
    <div>
      {filteredTasks.length > 0 ? (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li key={task.id} className="p-4 bg-[#003366] rounded-lg flex justify-between items-center">
              <span>{task.taskName} - {task.assignedTo}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${task.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No {filter} tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
