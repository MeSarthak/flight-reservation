// src/pages/admin/ManageAircrafts.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AircraftTable from "../../components/admin/AircraftTable";
import AdminNavbar from "../../components/admin/AdminNavbar";

const ManageAircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [totalSeats, setTotalSeats] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editSeats, setEditSeats] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAircrafts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/adminPanel/aircrafts");
      if (res.data.status) setAircrafts(res.data.aircrafts);
    } catch (err) {
      console.error("Error fetching aircrafts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new aircraft
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!totalSeats) return alert("Please enter total seats");
    try {
      await axiosInstance.post("/adminPanel/aircrafts", { total_seats: totalSeats });
      setTotalSeats("");
      fetchAircrafts();
      alert("Aircraft added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add aircraft.");
    }
  };

  // Delete aircraft
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this aircraft?")) return;
    try {
      await axiosInstance.delete(`/adminPanel/aircrafts/${id}`);
      fetchAircrafts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete aircraft.");
    }
  };

  // Edit button clicked
  const handleEdit = (id) => {
    const selected = aircrafts.find((a) => a.aircraft_id === id);
    if (selected) {
      setEditingId(id);
      setEditSeats(selected.total_seats);
    }
  };

  // Save updated aircraft
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editSeats) return alert("Please enter total seats");

    try {
      await axiosInstance.patch(`/adminPanel/aircrafts/${editingId}`, {
        total_seats: editSeats,
      });
      alert("Aircraft updated successfully!");
      setEditingId(null);
      setEditSeats("");
      fetchAircrafts();
    } catch (err) {
      console.error("Error updating aircraft:", err);
      alert("Failed to update aircraft.");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSeats("");
  };

  useEffect(() => {
    fetchAircrafts();
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
                <i className="fas fa-fighter-jet text-primary-600"></i>
                Manage Aircrafts
              </h1>
              <p className="text-gray-600 mt-1">View and manage aircraft fleet</p>
            </div>
          </div>
        </div>

        {/* Add Aircraft Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50 animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-primary-600"></i>
            Add New Aircraft
          </h2>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-chair mr-2 text-primary-500"></i>Total Seats
              </label>
              <input
                type="number"
                placeholder="Enter total seats"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Aircraft
              </button>
            </div>
          </form>
        </div>

        {/* Edit Form */}
        {editingId && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-6 mb-8 border-2 border-primary-200 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-edit text-primary-600"></i>
              Editing Aircraft ID: <span className="text-primary-600">{editingId}</span>
            </h3>
            <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-chair mr-2 text-primary-500"></i>Total Seats
                </label>
                <input
                  type="number"
                  placeholder="Enter total seats"
                  value={editSeats}
                  onChange={(e) => setEditSeats(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/50">
            <i className="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
            <p className="text-xl font-semibold text-gray-700">Loading aircrafts...</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-300">
            <AircraftTable
              aircrafts={aircrafts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAircrafts;
