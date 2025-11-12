// src/pages/admin/AddFlight.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const AddFlight = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    flight_number: "",
    aircraft_id: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
    base_fare: "",
    airline: "",
  });

  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🛫 Fetch all airports once component mounts
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await axiosInstance.get("/adminPanel/airports");
        if (res.data.status && Array.isArray(res.data.airports)) {
          setAirports(res.data.airports);
        } else {
          console.error("Invalid airport data:", res.data);
        }
      } catch (err) {
        console.error("Error fetching airports:", err);
      }
    };

    fetchAirports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/adminPanel/flights", form);
      if (res.data.status) {
        alert("✅ Flight added successfully!");
        navigate("/admin/manage-flights");
      } else {
        setError(res.data.message || "Failed to add flight");
      }
    } catch (err) {
      console.error("Error adding flight:", err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-6">
          ➕ Add New Flight
        </h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Flight Number */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Flight Number
            </label>
            <input
              type="text"
              name="flight_number"
              value={form.flight_number}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {/* Airline */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Airline</label>
            <input
              type="text"
              name="airline"
              value={form.airline}
              onChange={handleChange}
              placeholder="Optional"
              className="border p-2 w-full rounded-md"
            />
          </div>

          {/* Aircraft ID */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Aircraft ID
            </label>
            <input
              type="number"
              name="aircraft_id"
              value={form.aircraft_id}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {/* Base Fare */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Base Fare (₹)
            </label>
            <input
              type="number"
              name="base_fare"
              value={form.base_fare}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {/* Departure Airport */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Departure Airport
            </label>
            <select
              name="departure_airport_id"
              value={form.departure_airport_id}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            >
              <option value="">Select Departure Airport</option>
              {airports.map((airport) => (
                <option key={airport.airport_id} value={airport.airport_id}>
                  {airport.name} — {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </div>

          {/* Arrival Airport */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Arrival Airport
            </label>
            <select
              name="arrival_airport_id"
              value={form.arrival_airport_id}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            >
              <option value="">Select Arrival Airport</option>
              {airports.map((airport) => (
                <option key={airport.airport_id} value={airport.airport_id}>
                  {airport.name} — {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Departure Time
            </label>
            <input
              type="datetime-local"
              name="departure_time"
              value={form.departure_time}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Arrival Time
            </label>
            <input
              type="datetime-local"
              name="arrival_time"
              value={form.arrival_time}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlight;
