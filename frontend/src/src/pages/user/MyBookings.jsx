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
      setBookings((b) => b.filter((x) => x.booking_id !== bookingId && x.id !== bookingId));
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
              <div className="mt-2">
                <button className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/flights/${b.flight_id || b.flight?.flight_id}`)}>View flight</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleCancel(b.booking_id || b.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

