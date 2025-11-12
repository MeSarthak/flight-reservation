// src/components/user/FlightCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center hover:shadow-md transition">
      <div>
        <h3 className="text-lg font-semibold">{flight.airline || "Airline"}</h3>
        <p className="text-sm text-gray-600">{flight.flight_number}</p>

        <div className="flex items-center mt-2 space-x-4">
          <div>
            <p className="font-medium">{flight.departure_code}</p>
            <p className="text-xs text-gray-500">{flight.departure_airport}</p>
          </div>
          <span className="text-gray-400">→</span>
          <div>
            <p className="font-medium">{flight.arrival_code}</p>
            <p className="text-xs text-gray-500">{flight.arrival_airport}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Departure: {new Date(flight.departure_time).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          Arrival: {new Date(flight.arrival_time).toLocaleString()}
        </p>
      </div>

      <div className="mt-3 sm:mt-0 text-center sm:text-right">
        <p className="text-lg font-semibold text-blue-600">
          ₹{flight.base_fare}
        </p>
        <button
          onClick={() => navigate(`/flights/${flight.flight_id}`)}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
