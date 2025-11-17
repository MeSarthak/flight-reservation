import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromBookings = location.state?.fromBookings || false;
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatsInfo, setSeatsInfo] = useState({ total: 0, available: 0, booked: 0 });

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
        // fetch seats info for availability counts
        try {
          const seatRes = await axiosInstance.get(`/seats/flight/${id}`);
          const seatList = seatRes.data.seats || seatRes.data || [];
          const booked = seatList.filter((s) => s.available === false).length;
          const available = seatList.filter((s) => s.available === true).length;
          setSeatsInfo({ total: seatList.length || (flightData.total_seats || 0), available, booked });
        } catch (e) {
          // fallback to total seats only
          setSeatsInfo({ total: flightData.total_seats || 0, available: 0, booked: 0 });
        }
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
    // Navigate to seat selection first
    navigate(`/flights/${id}/seats`, { state: { flight } });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-4xl border border-white/50 animate-fade-in-up">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-plane text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Flight {flight.flight_number || flight.flight_id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Flight Details</p>
            </div>
          </div>
        </div>

        {/* Flight Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-clock text-blue-600"></i>
              <p className="text-xs font-semibold text-blue-700">Duration</p>
            </div>
            <p className="text-xl font-bold text-gray-800">{flight.duration || "N/A"}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-rupee-sign text-green-600"></i>
              <p className="text-xs font-semibold text-green-700">Base Fare</p>
            </div>
            <p className="text-xl font-bold text-gray-800">
              ₹{flight.base_fare ? Number(flight.base_fare).toFixed(2) : "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-chair text-purple-600"></i>
              <p className="text-xs font-semibold text-purple-700">Total Seats</p>
            </div>
            <p className="text-xl font-bold text-gray-800">{seatsInfo.total || flight.total_seats || "N/A"}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-check-circle text-orange-600"></i>
              <p className="text-xs font-semibold text-orange-700">Available</p>
            </div>
            <p className="text-xl font-bold text-gray-800">{seatsInfo.available}</p>
          </div>
        </div>

        {/* Departure & Arrival - Enhanced */}
        <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 p-6 rounded-2xl mb-6 border border-primary-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Departure */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                <i className="fas fa-plane-departure text-primary-600 text-xl"></i>
                <h3 className="text-lg font-bold text-gray-800">Departure</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">
                {flight.departure_code || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {flight.departure_airport || flight.from || "N/A"}
              </p>
              <p className="text-lg font-semibold text-primary-600">
                <i className="fas fa-calendar-alt mr-2"></i>
                {formatDate(flight.departure_time || flight.departure)}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center my-4 sm:my-0">
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full"></div>
                <i className="fas fa-arrow-right text-2xl text-primary-600"></i>
                <div className="w-20 h-1 bg-gradient-to-r from-secondary-300 to-primary-300 rounded-full"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-end">
                <h3 className="text-lg font-bold text-gray-800">Arrival</h3>
                <i className="fas fa-plane-arrival text-secondary-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">
                {flight.arrival_code || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {flight.arrival_airport || flight.to || "N/A"}
              </p>
              <p className="text-lg font-semibold text-secondary-600">
                <i className="fas fa-calendar-alt mr-2"></i>
                {formatDate(flight.arrival_time || flight.arrival)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Aircraft ID</p>
            <p className="text-lg font-semibold text-gray-800">{flight.aircraft_id || "N/A"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Booked Seats</p>
            <p className="text-lg font-semibold text-gray-800">{seatsInfo.booked}</p>
          </div>
        </div>

        {/* Book Button */}
        {!fromBookings && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBook}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl flex items-center gap-3"
            >
              <i className="fas fa-ticket-alt"></i>
              Book This Flight
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetails;
