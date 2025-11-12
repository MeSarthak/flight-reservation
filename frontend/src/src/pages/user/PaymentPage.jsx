import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;
  console.log("PaymentPage flight:", state);
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "" },
  ]);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const amount = (flight?.price || 0) * passengers.length;

  const updatePassenger = (idx, key, value) => {
    setPassengers((p) => p.map((pp, i) => (i === idx ? { ...pp, [key]: value } : pp)));
  };

  const addPassenger = () => setPassengers((p) => [...p, { name: "", age: "", gender: "" }]);

  const removePassenger = (idx) => setPassengers((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flight) return setError("No flight selected");
    if (passengers.some((p) => !p.name)) return setError("Please fill passenger names");
    setError(null);
    setLoading(true);
    try {
      // Create booking
      const payload = {
        flight_id: flight.flight_id || flight.id || flight.flightId,
        passengers,
      };
      console.log("Booking payload:", payload);
      const bookingRes = await axiosInstance.post(`/bookings`, payload);
      const booking = bookingRes.data.booking || bookingRes.data;
      const bookingId = booking.booking_id || booking.insertId || booking.id || booking.bookingId;

      if (!bookingId) throw new Error("Booking id not returned by server");

      // Create payment
      const paymentPayload = {
        booking_id: bookingId,
        amount,
        method,
      };
      await axiosInstance.post(`/payments`, paymentPayload);

      // Success: go to My Bookings
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Payment or booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Payment</h2>
      {!flight && (
        <div className="mb-4">No flight selected. Go back to flights and choose one.</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Passengers</label>
          <div className="space-y-2 mt-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className="border p-2 flex-1" placeholder="Name" value={p.name} onChange={(e)=>updatePassenger(i,'name',e.target.value)} />
                <input className="w-20 border p-2" placeholder="Age" value={p.age} onChange={(e)=>updatePassenger(i,'age',e.target.value)} />
                <input className="w-24 border p-2" placeholder="Gender" value={p.gender} onChange={(e)=>updatePassenger(i,'gender',e.target.value)} />
                {i>0 && <button type="button" className="bg-red-500 text-white px-2 rounded" onClick={()=>removePassenger(i)}>Remove</button>}
              </div>
            ))}
            <button type="button" className="mt-2 bg-gray-200 px-3 py-1 rounded" onClick={addPassenger}>Add passenger</button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Payment method</label>
          <select value={method} onChange={(e)=>setMethod(e.target.value)} className="border p-2 mt-1 w-full">
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div>
          <strong>Total:</strong> ${amount.toFixed(2)}
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div>
          <button disabled={loading} onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Processing..." : "Pay & Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
