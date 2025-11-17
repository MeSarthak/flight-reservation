// src/pages/admin/ManageAirports.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/storage";
import AirportTable from "../../components/admin/AirportTable";
import AdminNavbar from "../../components/admin/AdminNavbar";

const ManageAirports = () => {
  const [airports, setAirports] = useState([]);
  const [form, setForm] = useState({
    airport_name: "",
    airport_code: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/adminPanel/airports");
      if (res.data.status) setAirports(res.data.airports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      
      await axiosInstance.post("/adminPanel/airports", form);
      setForm({ airport_name: "", airport_code: "", city: "", country: "" });
      fetchAirports();
      alert("Airport added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add airport.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this airport?")) return;
    try {
      await axiosInstance.delete(`/adminPanel/airports/${id}`);
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert("Failed to delete airport.");
    }
  };

  useEffect(() => {
    // If there's no token, redirect to login instead of calling admin APIs
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }

    fetchAirports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
              <i className="fas fa-plane text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <i className="fas fa-building text-primary-600"></i>
                Manage Airports
              </h1>
              <p className="text-gray-600 mt-1">View and manage airport locations</p>
            </div>
          </div>
        </div>

        {/* Add Airport Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-primary-600"></i>
            Add New Airport
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-building mr-2 text-primary-500"></i>Airport Name
              </label>
              <input
                name="airport_name"
                placeholder="Enter airport name"
                value={form.airport_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-code mr-2 text-primary-500"></i>Code
              </label>
              <input
                name="airport_code"
                placeholder="e.g., DEL"
                value={form.airport_code}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 uppercase"
                required
                maxLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-city mr-2 text-primary-500"></i>City
              </label>
              <input
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-globe mr-2 text-primary-500"></i>Country
              </label>
              <input
                name="country"
                placeholder="Enter country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="col-span-full flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Airport
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/50">
            <i className="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
            <p className="text-xl font-semibold text-gray-700">Loading airports...</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-300">
            <AirportTable airports={airports} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAirports;
