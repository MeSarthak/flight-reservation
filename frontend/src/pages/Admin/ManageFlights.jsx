// src/pages/admin/ManageFlights.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import FlightTable from "../../components/admin/FlightTable";
import AdminNavbar from "../../components/admin/AdminNavbar";

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  // Fetch flights
  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/adminPanel/flights?page=${page}&limit=${limit}`
      );
      if (res.data.status) {
        setFlights(res.data.flights || []);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete flight
  const handleDelete = async (flightId) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;

    try {
      await axiosInstance.delete(`/adminPanel/flights/${flightId}`);
      alert("Flight deleted successfully!");
      fetchFlights();
    } catch (err) {
      console.error(err);
      alert("Failed to delete flight.");
    }
  };

  // Handle edit flight
  const handleEdit = (flightId) => {
    navigate(`/admin/edit-flight/${flightId}`);
  };

  // Pagination controls
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => setPage(page + 1);

  useEffect(() => {
    fetchFlights();
  }, [page]);

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
                <i className="fas fa-plane-departure text-primary-600"></i>
                Manage Flights
              </h1>
              <p className="text-gray-600 mt-1">View and manage all flight schedules</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-flight")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Flight
          </button>
        </div>

      {loading ? (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/50">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
          <p className="text-xl font-semibold text-gray-700">Loading flights...</p>
        </div>
      ) : (
        <>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-300">
            <FlightTable
              flights={flights}
              onDelete={handleDelete}
            />
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="bg-white/80 backdrop-blur-lg px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-200 flex items-center gap-2"
            >
              <i className="fas fa-chevron-left"></i>
              Prev
            </button>
            <span className="bg-white/80 backdrop-blur-lg px-6 py-2.5 rounded-xl font-bold text-gray-800 shadow-lg border border-gray-200">
              Page {page}
            </span>
            <button
              onClick={handleNext}
              className="bg-white/80 backdrop-blur-lg px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-200 flex items-center gap-2"
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ManageFlights;
