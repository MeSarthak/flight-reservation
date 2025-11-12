// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import AdminNavbar from "../../components/admin/AdminNavbar";
import RevenueChart from "../../components/admin/RevenueChart";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch revenue data
  const fetchRevenue = async (selectedYear) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/adminPanel/analytics/revenue?year=${selectedYear}`
      );
      if (res.data.status && Array.isArray(res.data.revenue)) {
        setRevenueData(res.data.revenue);
      } else {
        setRevenueData([]);
      }
    } catch (err) {
      console.error("Error fetching revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(year);
  }, [year]);

  return (
    <div>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">🛫 Admin Dashboard</h1>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border p-2 rounded-md"
            >
                {[2025, 2024, 2023].map((y) => (
                <option key={y} value={y}>
                    {y}
                </option>
                ))}
            </select>
            <button
                onClick={() => fetchRevenue(year)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Refresh
            </button>
            </div>
        </div>

        {/* <div className="flex flex-wrap gap-4 mb-6">
            <button
            onClick={() => navigate("/admin/manage-flights")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
            ✈️ Manage Flights
            </button>
            <button
            onClick={() => navigate("/admin/add-flight")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
            ➕ Add New Flight
            </button>
        </div> */}

        {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading analytics...</p>
        ) : (
            <RevenueChart data={revenueData} year={year} />
        )}
        </div>
    </div>
  );
};

export default Dashboard;
