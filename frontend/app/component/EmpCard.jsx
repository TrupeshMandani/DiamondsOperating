export default function EmpCard({ title, children }) {
  return (
    <div className="p-4 bg-[#1A405E] text-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="bg-gray-800 p-3 rounded-lg">{children}</div>
    </div>
  );
}
