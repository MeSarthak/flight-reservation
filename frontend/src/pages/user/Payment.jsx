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
      const serverMessage = err.response?.data?.message;
      if (serverMessage && serverMessage.toLowerCase().includes("seat")) {
        setError("One or more selected seats are no longer available. Please go back and select different seats.");
      } else {
        setError(serverMessage || "Payment or booking failed. Please try again.");
      }
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
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-white/50 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-credit-card text-white text-xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Payment Details</h2>
          </div>
          {flight && (
            <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
              <i className="fas fa-plane mr-2 text-blue-500"></i>
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
              <label className="block font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <i className="fas fa-users text-primary-600"></i>
                Passenger Details
              </label>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-3 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex-1 relative">
                      <i className="fas fa-user absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Full Name"
                        value={p.name}
                        onChange={(e) => updatePassenger(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <i className="fas fa-birthday-cake absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        className="w-28 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Age"
                        value={p.age}
                        onChange={(e) => updatePassenger(i, "age", e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <i className="fas fa-venus-mars absolute left-3 top-3.5 text-gray-400"></i>
                      <select
                        className="w-32 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={p.gender}
                        onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                      >
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <i className="fas fa-wallet text-secondary-600"></i>
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    method === "card"
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <i className="fas fa-credit-card text-2xl mb-2 text-indigo-600"></i>
                  <p className="font-semibold text-gray-800">Card</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    method === "upi"
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <i className="fas fa-mobile-alt text-2xl mb-2 text-indigo-600"></i>
                  <p className="font-semibold text-gray-800">UPI</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("netbanking")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    method === "netbanking"
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <i className="fas fa-university text-2xl mb-2 text-indigo-600"></i>
                  <p className="font-semibold text-gray-800">Net Banking</p>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg text-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <h3 className="text-4xl font-bold flex items-center gap-2 text-green-600">
                    <i className="fas fa-rupee-sign text-3xl"></i>
                    {amount.toFixed(2)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <i className="fas fa-users mr-1"></i>
                    For {passengers.length} passenger{passengers.length > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  } text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i>
                      Pay & Book Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 px-5 py-4 rounded-lg flex items-start gap-3 animate-slide-up">
                <i className="fas fa-exclamation-circle text-red-500 text-xl mt-0.5"></i>
                <span className="text-sm font-medium text-red-800">{error}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Payment;
