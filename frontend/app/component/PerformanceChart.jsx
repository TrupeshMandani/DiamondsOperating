"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PerformanceChart = ({ data }) => {
  return (
    <div className="bg-[#002A4E] p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-center">Performance Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip contentStyle={{ backgroundColor: "#002A5E", color: "#ffffff" }} />
          <Bar dataKey="value" fill="#1E90FF" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
