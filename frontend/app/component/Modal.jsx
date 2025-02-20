"use client";

import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, title, data }) => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const filteredData = data.filter((item) =>
    (item.name || item.task || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg w-[400px] relative max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-3 bg-[#003366] text-white rounded"
        />

        {filteredData.length > 0 ? (
          <ul className="text-gray-200 space-y-2">
            {filteredData.map((item, index) => (
              <li key={index} className="p-2 bg-[#003366] rounded-lg">
                <strong>{item.name || item.task}</strong> - {item.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-200">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
