"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Importing the Bar chart component from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar";

// Registering Chart.js components for the bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EarningsDashboard = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [yearlyEarnings, setYearlyEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employeeId from localStorage
  const employeeId = localStorage.getItem("employeeId"); // Ensure this is set somewhere before

  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchEarningsData = async () => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(employeeId)) {
          throw new Error("Invalid employee ID format");
        }

        const response = await axios.get(
          `http://localhost:5023/api/earnings/${employeeId}`
        );
        const earningsData = response.data.data;

        if (!Array.isArray(earningsData)) {
          throw new Error("Invalid data format received");
        }

        setEarningsData(earningsData);

        // Calculate the earnings for the selected month
        const selectedMonthData = earningsData.find(
          (entry) => entry.month === selectedMonth
        );
        const monthly = selectedMonthData ? selectedMonthData.totalEarnings : 0;

        // Calculate yearly earnings
        const yearly = earningsData
          .filter((entry) => entry.year === new Date().getFullYear())
          .reduce((acc, entry) => acc + entry.totalEarnings, 0);

        setMonthlyEarnings(monthly);
        setYearlyEarnings(yearly);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        // Reset earnings if there's an error
        if (err.response?.status === 404) {
          setMonthlyEarnings(0);
          setYearlyEarnings(0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [employeeId, selectedMonth]);

  // Prepare the chart data
  const prepareChartData = () => {
    const months = [
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
    ];
    const monthlyEarningsData = Array(12).fill(0); // Initialize array with zeroes for each month

    earningsData.forEach((entry) => {
      const monthIndex = entry.month - 1; // Adjust for 0-based index
      monthlyEarningsData[monthIndex] = entry.totalEarnings;
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Monthly Earnings",
          data: monthlyEarningsData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Inline CSS styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: "2rem",
      padding: "1.5rem",
      flexWrap: "wrap", // Makes sure it looks good on mobile
    },
    card: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s",
      flex: "1 1 45%", // Makes it responsive for larger and smaller screens
      ":hover": {
        transform: "translateY(-2px)",
      },
    },
    amount: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#2d3748",
      margin: "1rem 0",
    },
    period: {
      color: "#718096",
      fontSize: "0.9rem",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      padding: "2rem",
      fontSize: "1.2rem",
    },
    error: {
      color: "#e53e3e",
      padding: "2rem",
      textAlign: "center",
    },
    dropdown: {
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "8px",
      border: "1px solid #ddd",
      marginBottom: "1rem",
      width: "100%",
    },
    chartContainer: {
      flex: "1 1 45%", // Makes it responsive and ensures the graph takes up half of the space
      minWidth: "300px", // Ensures the chart doesn't get too small
    },
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  if (loading)
    return <div style={styles.loading}>Loading earnings data...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Dropdown Menu */}
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        style={styles.dropdown}
      >
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>

      <div style={styles.container}>
        <div style={styles.card}>
          <h3>Monthly Earnings</h3>
          <div style={styles.amount}>₹{monthlyEarnings.toLocaleString()}</div>
          <p style={styles.period}>
            {new Date(new Date().setMonth(selectedMonth - 1)).toLocaleString(
              "default",
              { month: "long" }
            )}{" "}
            {new Date().getFullYear()}
          </p>
        </div>

        <div style={styles.card}>
          <h3>Yearly Earnings</h3>
          <div style={styles.amount}>₹{yearlyEarnings.toLocaleString()}</div>
          <p style={styles.period}>Calendar Year {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div style={styles.chartContainer}>
        <Bar data={prepareChartData()} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default EarningsDashboard;
