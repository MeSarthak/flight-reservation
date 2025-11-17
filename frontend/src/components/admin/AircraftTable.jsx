// src/components/admin/AircraftTable.jsx
import React from "react";

const AircraftTable = ({ aircrafts, onEdit, onDelete }) => {
  if (!aircrafts.length)
    return (
      <div className="text-center py-12">
        <i className="fas fa-plane-slash text-5xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">No aircrafts found.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-fighter-jet mr-2"></i>Aircraft ID
            </th>
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-chair mr-2"></i>Total Seats
            </th>
            <th className="p-4 border-b text-center font-semibold">
              <i className="fas fa-cog mr-2"></i>Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((a, idx) => (
            <tr
              key={a.aircraft_id}
              className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b last:border-none text-gray-800 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <td className="p-4">
                <span className="font-bold text-primary-600 text-lg">{a.aircraft_id}</span>
              </td>
              <td className="p-4">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                  <i className="fas fa-users mr-2"></i>
                  {a.total_seats} Seats
                </span>
              </td>
              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => onEdit(a.aircraft_id)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(a.aircraft_id)}
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
  );
};

export default AircraftTable;
