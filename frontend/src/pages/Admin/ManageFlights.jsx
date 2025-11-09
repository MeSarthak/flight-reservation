// src/pages/admin/ManageFlights.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import FlightTable from "../../components/admin/FlightTable";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold mb-4 sm:mb-0">🛬 Manage Flights</h1>

        <button
          onClick={() => navigate("/admin/add-flight")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          ➕ Add Flight
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading flights...</p>
      ) : (
        <>
          <FlightTable
            flights={flights}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="bg-gray-200 px-3 py-1 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium">Page {page}</span>
            <button
              onClick={handleNext}
              className="bg-gray-200 px-3 py-1 rounded-md"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageFlights;
