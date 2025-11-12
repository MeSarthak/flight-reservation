import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { UserPlus, CreditCard, Trash2, IndianRupee, Loader2, PlaneTakeoff } from "lucide-react";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;

  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "" }]);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const amount = (flight?.price || flight?.base_fare || 0) * passengers.length;

  const updatePassenger = (idx, key, value) => {
    setPassengers((p) => p.map((pp, i) => (i === idx ? { ...pp, [key]: value } : pp)));
  };

  const addPassenger = () => setPassengers((p) => [...p, { name: "", age: "", gender: "" }]);
  const removePassenger = (idx) => setPassengers((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flight) return setError("No flight selected");
    if (passengers.some((p) => !p.name)) return setError("Please fill all passenger names");

    setError(null);
    setLoading(true);
    try {
      // ✈️ Create booking
      const payload = {
        flight_id: flight.flight_id || flight.id,
        passengers,
      };
      const bookingRes = await axiosInstance.post(`/bookings`, payload);
      const booking = bookingRes.data.booking || bookingRes.data;
      const bookingId = booking.booking_id || booking.id;

      // 💳 Create payment
      const paymentPayload = {
        booking_id: bookingId,
        amount,
        method,
      };
      await axiosInstance.post(`/payments`, paymentPayload);

      // ✅ Redirect
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment or booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-indigo-600" /> Payment Details
          </h2>
          {flight && (
            <div className="text-sm text-gray-600">
              <PlaneTakeoff className="inline w-5 h-5 mr-1 text-blue-500" />
              {flight.departure_airport} → {flight.arrival_airport}
            </div>
          )}
        </div>

        {!flight ? (
          <div className="text-gray-600 text-center py-6">
            No flight selected. Please return to the flights page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Passenger Info */}
            <div>
              <label className="block font-semibold text-gray-800 text-lg mb-2">
                Passenger Details
              </label>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <input
                      className="border p-2 flex-1 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Full Name"
                      value={p.name}
                      onChange={(e) => updatePassenger(i, "name", e.target.value)}
                    />
                    <input
                      className="border p-2 w-28 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) => updatePassenger(i, "age", e.target.value)}
                    />
                    <select
                      className="border p-2 w-32 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={p.gender}
                      onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(i)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-200 transition-all duration-200"
                  onClick={addPassenger}
                >
                  <UserPlus className="w-4 h-4" /> Add Passenger
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-gray-800 text-lg mb-2">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 text-gray-800"
              >
                <option value="card">💳 Credit / Debit Card</option>
                <option value="upi">📱 UPI</option>
                <option value="netbanking">🏦 Net Banking</option>
              </select>
            </div>

            {/* Summary */}
            <div className="bg-gray-100 p-5 rounded-2xl shadow-inner text-gray-800 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <h3 className="text-2xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  {amount.toFixed(2)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  For {passengers.length} passenger{passengers.length > 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Pay & Book
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md text-center font-medium">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Payment;
