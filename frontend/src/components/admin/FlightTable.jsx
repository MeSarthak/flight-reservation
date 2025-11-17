// src/components/admin/FlightTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const FlightTable = ({ flights, onDelete }) => {
  const navigate = useNavigate();

  // Navigate to edit page
  const handleEdit = (flightId) => {
    navigate(`/admin/edit-flight/${flightId}`);
  };

  return (
    <div>
      {flights.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-plane-slash text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">No flights available.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-hashtag mr-2"></i>#
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-plane mr-2"></i>Flight No.
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-map-marker-alt mr-2"></i>From
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-map-marker-alt mr-2"></i>To
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-calendar-alt mr-2"></i>Departure
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-calendar-check mr-2"></i>Arrival
              </th>
              <th className="p-4 border-b font-semibold">
                <i className="fas fa-rupee-sign mr-2"></i>Fare
              </th>
              <th className="p-4 border-b text-center font-semibold">
                <i className="fas fa-cog mr-2"></i>Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {flights.map((flight, index) => (
              <tr
                key={flight.flight_id}
                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b last:border-none text-gray-800 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-4 font-medium">{index + 1}</td>
                <td className="p-4">
                  <span className="font-bold text-primary-600">{flight.flight_number}</span>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">
                    {flight.departure_code}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs">
                    {flight.arrival_code}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-600">
                  {new Date(flight.departure_time).toLocaleString()}
                </td>
                <td className="p-4 text-xs text-gray-600">
                  {new Date(flight.arrival_time).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="font-bold text-green-600">
                    <i className="fas fa-rupee-sign mr-1"></i>
                    {flight.base_fare}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(flight.flight_id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(flight.flight_id)}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto mt-2"
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;
