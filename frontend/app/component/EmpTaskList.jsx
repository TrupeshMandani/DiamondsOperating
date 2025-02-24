import EmpCard from "./EmpCard";
import EmpTaskCard from "./EmpTaskCard";

const tasks = {
  assigned: [
    { id: "B001", start: "10:00 AM", end: "12:00 PM" },
    { id: "B002", start: "12:30 PM", end: "2:30 PM" },
    { id: "B003", start: "12:45 PM", end: "2:30 PM" },
  ],
  inProgress: [{ id: "B003", start: "3:00 PM", end: "5:00 PM" }],
  completed: [{ id: "B004", start: "8:00 AM", end: "10:00 AM" }],
};

const EmpTaskList = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(tasks).map(([status, taskList]) => (
        <EmpCard
          key={status}
          title={`${status.charAt(0).toUpperCase() + status.slice(1)} Tasks`}
        >
          {taskList.map((task) => (
            <EmpTaskCard key={task.id} task={task} status={status} />
          ))}
        </EmpCard>
      ))}
    </div>
  );
};

export default EmpTaskList;
