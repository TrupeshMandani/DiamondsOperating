"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const EarningsDashboard = ({ employeeId }) => {
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [yearlyEarnings, setYearlyEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Combined API calls
  const fetchEarningsData = async () => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(employeeId)) {
        throw new Error("Invalid employee ID format");
      }

      const [monthlyRes, yearlyRes] = await Promise.all([
        axios.get(`http://localhost:5023/api/earnings/${employeeId}/monthly`),
        axios.get(`http://localhost:5023/api/earnings/${employeeId}/yearly`),
      ]);

      setMonthlyEarnings(monthlyRes.data.totalEarnings || 0);
      setYearlyEarnings(yearlyRes.data.yearlyEarnings || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // Handle specific 404 for monthly earnings
      if (err.response?.status === 404) {
        setMonthlyEarnings(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [employeeId]);

  // Inline CSS styles
  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      padding: "1.5rem",
    },
    card: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s",
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
  };

  if (loading)
    return <div style={styles.loading}>Loading earnings data...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>Monthly Earnings</h3>
        <div style={styles.amount}>₹{monthlyEarnings.toLocaleString()}</div>
        <p style={styles.period}>Current Month</p>
      </div>

      <div style={styles.card}>
        <h3>Yearly Earnings</h3>
        <div style={styles.amount}>₹{yearlyEarnings.toLocaleString()}</div>
        <p style={styles.period}>Current Year</p>
      </div>
    </div>
  );
};

export default EarningsDashboard;
