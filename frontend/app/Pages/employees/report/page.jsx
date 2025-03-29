"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TotalEarnings() {
  const [totalEarnings, setTotalEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [months, setMonths] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [message, setMessage] = useState(""); // Add state for message

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId"); // Fetch employeeId from localStorage
    if (!employeeId) {
      setError("Employee ID not found in localStorage");
      setLoading(false);
      return;
    }

    fetchEarnings(employeeId, selectedMonth);
  }, [selectedMonth]); // Re-fetch when selectedMonth changes

  const fetchEarnings = (employeeId, month) => {
    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:5023/api/earnings/${employeeId}/${month}/2025` // Modify the endpoint to use month and year
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("You have no record for this month."); // Throw an error if response is not ok
        }
        return response.json();
      })
      .then((data) => {
        setTotalEarnings(data.totalEarnings);
        setMessage(data.message); // Set the message from the response
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value)); // Update selected month
  };

  const data = {
    labels: [months[selectedMonth - 1]], // Display the selected month name
    datasets: [
      {
        label: "Total Earnings",
        data: [totalEarnings || 0], // Show earnings (0 if not found)
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Earnings display section */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {totalEarnings === 0 ? (
              <p className="text-red-500">{message}</p> // Show the no record message
            ) : (
              <p className="text-2xl font-bold text-green-600">
                ${totalEarnings}
              </p>
            )}
          </div>
        )}

        {/* Month selector */}
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="mt-4 p-2 border rounded"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Chart section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Earnings Chart</h2>
        <Bar data={data} />
      </div>
    </div>
  );
}
