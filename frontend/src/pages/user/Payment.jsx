import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { CreditCard, IndianRupee, Loader2, PlaneTakeoff, CheckCircle } from "lucide-react";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;
  const incomingSelectedSeats = state?.selectedSeats || [];

  // Initialize passengers according to selected seats (if provided)
  const initialPassengers = () => {
    if (incomingSelectedSeats && incomingSelectedSeats.length > 0) {
      return incomingSelectedSeats.map((s) => ({ name: "", age: "", gender: "", seat_id: s.seat_id, seat_number: s.seat_number }));
    }
    return [{ name: "", age: "", gender: "" }];
  };

  const [passengers, setPassengers] = useState(initialPassengers);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const amount = (flight?.price || flight?.base_fare || 0) * passengers.length;

  const updatePassenger = (idx, key, value) => {
    setPassengers((p) => p.map((pp, i) => (i === idx ? { ...pp, [key]: value } : pp)));
  };

  // Passenger count is derived from selected seats (no add/remove controls here)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flight) return setError("No flight selected");
    if (passengers.some((p) => !p.name)) return setError("Please fill all passenger names");

    setError(null);
    setLoading(true);
    try {
      // ✈️ Create booking (ensure seat_id is included if available)
      const payload = {
        flight_id: flight.flight_id || flight.id,
        passengers: passengers.map((p) => ({ name: p.name, age: p.age, gender: p.gender, seat_id: p.seat_id || null })),
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

      // ✅ Show confirmation popup instead of redirecting
      setBookingDetails({
        bookingId: bookingId,
        amount: amount,
        passengerCount: passengers.length,
        flightNumber: flight.flight_number,
        from: flight.departure_code,
        to: flight.arrival_code
      });
      setShowConfirmation(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment or booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        {/* Success Icon */}
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your payment was successful and booking is confirmed.</p>

        {/* Booking Details */}
        {bookingDetails && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Booking ID:</span>
              <span>#{bookingDetails.bookingId}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Flight:</span>
              <span>{bookingDetails.flightNumber}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Route:</span>
              <span>{bookingDetails.from} → {bookingDetails.to}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">Passengers:</span>
              <span>{bookingDetails.passengerCount}</span>
            </div>
            <div className="flex justify-between text-gray-700 border-t pt-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-green-600 font-bold">₹{bookingDetails.amount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-all duration-200"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );

  if (showConfirmation) {
    return <ConfirmationModal />;
  }

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
                  </div>
                ))}
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
