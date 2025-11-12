import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✈️ Fetch Flight by ID
  useEffect(() => {
    if (!id) return;
    const fetchFlight = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/flights/${id}`);
        const flightData = res.data.flight || res.data;

        // 🕒 Calculate duration (in hours and minutes)
        if (flightData.departure_time && flightData.arrival_time) {
          const depTime = new Date(flightData.departure_time);
          const arrTime = new Date(flightData.arrival_time);
          const diffMs = arrTime - depTime;

          if (diffMs > 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            flightData.duration = `${diffHours}h ${diffMinutes}m`;
          } else {
            flightData.duration = "Invalid time range";
          }
        } else {
          flightData.duration = "N/A";
        }

        setFlight(flightData);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load flight details");
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  const handleBook = () => {
    navigate("/payment", { state: { flight } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600 text-lg">Loading flight details...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600 text-lg">❌ {error}</div>;
  if (!flight)
    return <div className="p-6 text-center text-gray-600">Flight not found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            ✈️ Flight {flight.flight_number || flight.flight_id}
          </h1>
        </div>

        {/* Divider */}
        <hr className="mb-4 border-gray-300" />

        {/* Flight Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p>
              <strong>Aircraft ID:</strong> {flight.aircraft_id || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong> {flight.duration || "N/A"}
            </p>
          </div>

          <div>
            <p>
              <strong>Base Fare:</strong> ₹
              {flight.base_fare ? Number(flight.base_fare).toFixed(2) : "N/A"}
            </p>
            <p>
              <strong>Total Seats:</strong> {flight.total_seats || "N/A"}
            </p>
          </div>
        </div>

        {/* Departure & Arrival */}
        <div className="bg-gray-100 p-4 rounded-xl mt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-gray-800">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Departure</h3>
              <p className="text-sm text-gray-600">
                {flight.departure_airport || flight.from || "N/A"}
              </p>
              <p className="font-medium">
                {formatDate(flight.departure_time || flight.departure)}
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center">
              <div className="w-16 h-0.5 bg-gray-400"></div>
              <span className="mx-2 text-gray-500">→</span>
              <div className="w-16 h-0.5 bg-gray-400"></div>
            </div>

            <div className="flex-1 text-right sm:text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Arrival</h3>
              <p className="text-sm text-gray-600">
                {flight.arrival_airport || flight.to || "N/A"}
              </p>
              <p className="font-medium">
                {formatDate(flight.arrival_time || flight.arrival)}
              </p>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBook}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            🛒 Book Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
