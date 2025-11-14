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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.booking_id || b.id || b.booking_reference} className="border rounded p-4">
              <div className="mb-1"><strong>Reference:</strong> {b.booking_reference || b.reference}</div>
              <div className="mb-1"><strong>Flight:</strong> {b.flight_id || b.flight?.flight_id || b.flight_number}</div>
              <div className="mb-1"><strong>Status:</strong> {b.status || 'confirmed'}</div>
              <div className="mb-1"><strong>Amount Paid:</strong> ₹{b.amount ? Number(b.amount).toFixed(2) : 'N/A'}</div>
              <div className="mb-2"><strong>Passengers:</strong> {Array.isArray(b.passengers) ? b.passengers.length : (b.passenger_count || 0)}</div>
              {Array.isArray(b.passengers) && b.passengers.length > 0 && (
                <div className="mb-2 pl-3">
                  {b.passengers.map((p) => (
                    <div key={p.passenger_id} className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-1">
                      <div><strong>Name:</strong> {p.name}</div>
                      <div><strong>Age:</strong> {p.age || 'N/A'}</div>
                      <div><strong>Gender:</strong> {p.gender || 'N/A'}</div>
                      <div><strong>Seat:</strong> {p.seat_number || (p.seat_id ? `#${p.seat_id}` : 'Not assigned')}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <button className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/flights/${b.flight_id || b.flight?.flight_id}`, { state: { fromBookings: true } })}>View flight</button>
                {(b.status || '').toString().toLowerCase() !== 'cancelled' && (
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleCancel(b.booking_id || b.id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

