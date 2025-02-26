const tasks = [
  { id: 1, title: "Review Q2 Financial Report", status: "In Progress", assignee: "John Doe" },
  { id: 2, title: "Prepare Team Performance Reviews", status: "Pending", assignee: "Jane Smith" },
  { id: 3, title: "Update Project Management Software", status: "Completed", assignee: "Mike Johnson" },
  { id: 4, title: "Schedule Client Meetings for Next Week", status: "In Progress", assignee: "Sarah Lee" },
  { id: 5, title: "Finalize New Product Launch Strategy", status: "Pending", assignee: "Chris Brown" },
]

const TaskList = () => {
  return (
    <div className="bg-[#FCFCFC] rounded-lg p-6 shadow-md border border-[#1A405E]">
      <h2 className="text-2xl font-bold mb-4 text-[#111827]">Recent Tasks</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1A405E]">
              <th className="text-left py-2 px-4 text-[#111827]">Task</th>
              <th className="text-left py-2 px-4 text-[#111827]">Status</th>
              <th className="text-left py-2 px-4 text-[#111827]">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-[#1A405E] last:border-b-0">
                <td className="py-2 px-4 text-[#111827]">{task.title}</td>
                <td className="py-2 px-4 text-[#111827]">{task.status}</td>
                <td className="py-2 px-4 text-[#111827]">{task.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskList

