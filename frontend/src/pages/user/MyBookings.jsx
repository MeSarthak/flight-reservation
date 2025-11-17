import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try common endpoints. Backend may expose /bookings or /bookings/my
        let res;
        try {
          res = await axiosInstance.get(`/bookings`);
        } catch (e) {
          res = await axiosInstance.get(`/bookings/my`);
        }
        const data = res.data.bookings || res.data || [];
        setBookings(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.warn("Could not fetch bookings:", err);
        setError("No bookings found or endpoint unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
    else setLoading(false);
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await axiosInstance.post(`/bookings/${bookingId}/cancel`);
      // update booking status locally to reflect cancellation
      setBookings((prev) =>
        prev.map((bk) => {
          const id = bk.booking_id || bk.id;
          if (id === bookingId) return { ...bk, status: 'cancelled' };
          return bk;
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <div className="p-4">Loading bookings...</div>;
  if (!user) return <div className="p-4">Please log in to see your bookings.</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-calendar-check text-white text-2xl"></i>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">My Bookings</h2>
              <p className="text-gray-600 mt-1">View and manage your flight reservations</p>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/50">
            <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-search mr-2"></i>Browse Flights
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((b, index) => {
              const status = (b.status || 'confirmed').toLowerCase();
              const statusColors = {
                confirmed: 'from-green-500 to-emerald-500',
                cancelled: 'from-red-500 to-rose-500',
                pending: 'from-yellow-500 to-orange-500'
              };
              return (
                <div
                  key={b.booking_id || b.id || b.booking_reference}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Status Badge */}
                  <div className={`bg-gradient-to-r ${statusColors[status] || statusColors.confirmed} text-white px-6 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <i className={`fas ${status === 'confirmed' ? 'fa-check-circle' : status === 'cancelled' ? 'fa-times-circle' : 'fa-clock'} text-xl`}></i>
                      <span className="font-bold uppercase">{status}</span>
                    </div>
                    <span className="text-sm font-semibold">#{b.booking_reference || b.reference || 'N/A'}</span>
                  </div>

                  <div className="p-6">
                    {/* Flight Info */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <i className="fas fa-plane text-white"></i>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-800">Flight {b.flight_id || b.flight?.flight_id || b.flight_number || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Booking Reference</p>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">Amount Paid</p>
                        <p className="text-xl font-bold text-green-600">
                          <i className="fas fa-rupee-sign mr-1"></i>
                          {b.amount ? Number(b.amount).toFixed(2) : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                        <p className="text-xs text-gray-600 mb-1">Passengers</p>
                        <p className="text-xl font-bold text-purple-600">
                          <i className="fas fa-users mr-1"></i>
                          {Array.isArray(b.passengers) ? b.passengers.length : (b.passenger_count || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Passengers List */}
                    {Array.isArray(b.passengers) && b.passengers.length > 0 && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          <i className="fas fa-user-friends mr-2 text-primary-600"></i>Passenger Details
                        </p>
                        <div className="space-y-2">
                          {b.passengers.map((p) => (
                            <div key={p.passenger_id} className="flex flex-wrap items-center gap-3 text-sm bg-white p-2 rounded-lg border border-gray-200">
                              <span className="font-semibold text-gray-800">{p.name}</span>
                              <span className="text-gray-500">Age: {p.age || 'N/A'}</span>
                              <span className="text-gray-500">Gender: {p.gender || 'N/A'}</span>
                              <span className="text-primary-600 font-semibold">
                                <i className="fas fa-chair mr-1"></i>
                                Seat: {p.seat_number || (p.seat_id ? `#${p.seat_id}` : 'Not assigned')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                        onClick={() => navigate(`/flights/${b.flight_id || b.flight?.flight_id}`, { state: { fromBookings: true } })}
                      >
                        <i className="fas fa-eye"></i>
                        View Flight
                      </button>
                      {status !== 'cancelled' && (
                        <button
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                          onClick={() => handleCancel(b.booking_id || b.id)}
                        >
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

