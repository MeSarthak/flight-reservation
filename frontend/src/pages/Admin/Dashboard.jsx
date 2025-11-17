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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-tachometer-alt text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Analytics & Revenue Overview</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/50">
            <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 font-semibold"
            >
                {[2025, 2024, 2023].map((y) => (
                <option key={y} value={y}>
                    {y}
                </option>
                ))}
            </select>
            <button
                onClick={() => fetchRevenue(year)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                <i className="fas fa-sync-alt"></i>
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
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/50">
              <i className="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
              <p className="text-xl font-semibold text-gray-700">Loading analytics...</p>
            </div>
        ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 animate-fade-in-up">
              <RevenueChart data={revenueData} year={year} />
            </div>
        )}
        </div>
    </div>
  );
};

export default Dashboard;
