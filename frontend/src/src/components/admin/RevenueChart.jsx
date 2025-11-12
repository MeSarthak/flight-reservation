// src/components/admin/RevenueChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ data, year }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        💰 Monthly Revenue - {year}
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value.toFixed(2)}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No revenue data available for this year.
        </p>
      )}
    </div>
  );
};

export default RevenueChart;
