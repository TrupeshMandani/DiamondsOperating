"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const EarningsDashboard = ({ employeeId }) => {
  const [mounted, setMounted] = useState(false);
  const [earningsData, setEarningsData] = useState({
    monthly: 0,
    yearly: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Only run on client-side after mount
    setMounted(true);
    if (mounted && employeeId) {
      const fetchData = async () => {
        try {
          const [monthly, yearly] = await Promise.all([
            axios.get(`/api/earnings/${employeeId}/monthly`),
            axios.get(`/api/earnings/${employeeId}/yearly`),
          ]);

          setEarningsData({
            monthly: monthly.data.totalEarnings || 0,
            yearly: yearly.data.yearlyEarnings || 0,
            loading: false,
            error: null,
          });
        } catch (err) {
          setEarningsData((prev) => ({
            ...prev,
            loading: false,
            error:
              err.response?.data?.message || "Failed to load earnings data",
          }));
        }
      };

      fetchData();
    }
  }, [mounted, employeeId]);

  if (!mounted || earningsData.loading) {
    return <div className="loading">Loading earnings...</div>;
  }

  if (earningsData.error) {
    return <div className="error">Error: {earningsData.error}</div>;
  }

  return (
    <div className="earnings-dashboard">
      <div className="earnings-card">
        <h3>Monthly Earnings</h3>
        <div className="amount">
          ₹{earningsData.monthly.toLocaleString("en-IN")}
        </div>
        <p className="subtext">Current Month</p>
      </div>

      <div className="earnings-card">
        <h3>Yearly Earnings</h3>
        <div className="amount">
          ₹{earningsData.yearly.toLocaleString("en-IN")}
        </div>
        <p className="subtext">Current Year</p>
      </div>
    </div>
  );
};

// Parent component usage
const App = () => {
  // In a real app, get this from your auth context or state management
  const employeeId = "67db46a7c748bbc45093aeab";

  return (
    <div className="app-container">
      <h1>Employee Earnings Overview</h1>
      <EarningsDashboard employeeId={employeeId} />
    </div>
  );
};

export default App;
