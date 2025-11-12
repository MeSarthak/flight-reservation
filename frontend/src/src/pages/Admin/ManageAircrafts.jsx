// src/pages/admin/ManageAircrafts.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AircraftTable from "../../components/admin/AircraftTable";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold mb-4 sm:mb-0 text-gray-800"> Manage Aircrafts</h1>
      </div>

      {/* Add Aircraft Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 mb-6">
        <input
          type="number"
          placeholder="Total Seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          className="border p-2 rounded-md w-40"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ➕ Add Aircraft
        </button>
      </form>

      {editingId && (
        <form onSubmit={handleUpdate} className="flex items-center gap-3 mb-6 bg-white shadow p-4 rounded-md">
          <h3 className="font-medium">Editing Aircraft ID: {editingId}</h3>
          <input
            type="number"
            placeholder="Total Seats"
            value={editSeats}
            onChange={(e) => setEditSeats(e.target.value)}
            className="border p-2 rounded-md w-32"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            ✅ Update
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading aircrafts...</p>
      ) : (
        <AircraftTable
          aircrafts={aircrafts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ManageAircrafts;
