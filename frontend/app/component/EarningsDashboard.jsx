"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EarningsDashboard = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [yearlyEarnings, setYearlyEarnings] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const employeeId = localStorage.getItem("employeeId");

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

        const [earningsRes, tasksRes] = await Promise.all([
          axios.get(`http://localhost:5023/api/earnings/${employeeId}`),
          axios.get(`http://localhost:5023/api/employees/${employeeId}/tasks`)
        ]);

        const earningsData = earningsRes.data.data;
        const taskData = tasksRes.data;

        if (!Array.isArray(earningsData)) {
          throw new Error("Invalid earnings data format received");
        }

        setEarningsData(earningsData);

        const selectedMonthData = earningsData.find(
          (entry) => entry.month === selectedMonth
        );
        const monthly = selectedMonthData ? selectedMonthData.totalEarnings : 0;

        const yearly = earningsData
          .filter((entry) => entry.year === new Date().getFullYear())
          .reduce((acc, entry) => acc + entry.totalEarnings, 0);

        setMonthlyEarnings(monthly);
        setYearlyEarnings(yearly);

        const completed = taskData.filter((t) => t.status === "Completed").length;
        const total = taskData.length;
        const score = total > 0 ? Math.round((completed / total) * 100) : 0;
        setPerformanceScore(score);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 404) {
          setMonthlyEarnings(0);
          setYearlyEarnings(0);
          setPerformanceScore(0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [employeeId, selectedMonth]);

  const prepareChartData = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthlyEarningsData = Array(12).fill(0);
    earningsData.forEach((entry) => {
      const monthIndex = entry.month - 1;
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

  const preparePerformanceChartData = () => {
    return {
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          label: "Performance Progress",
          data: [performanceScore, 100 - performanceScore],
          backgroundColor: ["#10B981", "#E5E7EB"],
          borderWidth: 1,
        },
      ],
    };
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: "2rem",
      padding: "1.5rem",
      flexWrap: "wrap",
    },
    card: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s",
      flex: "1 1 45%",
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
      flex: "1 1 45%",
      minWidth: "300px",
      minHeight: "300px",
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
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        style={styles.dropdown}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <div style={styles.container}>
        <div style={styles.card}>
          <h3>Monthly Earnings</h3>
          <div style={styles.amount}>₹{monthlyEarnings.toLocaleString()}</div>
          <p style={styles.period}>
            {new Date(new Date().setMonth(selectedMonth - 1)).toLocaleString(
              "default",
              { month: "long" }
            )} {new Date().getFullYear()}
          </p>
        </div>

        <div style={styles.card}>
          <h3>Yearly Earnings</h3>
          <div style={styles.amount}>₹{yearlyEarnings.toLocaleString()}</div>
          <p style={styles.period}>Calendar Year {new Date().getFullYear()}</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.chartContainer}>
          <Bar data={prepareChartData()} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
        <div style={styles.chartContainer}>
          <Pie data={preparePerformanceChartData()} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;