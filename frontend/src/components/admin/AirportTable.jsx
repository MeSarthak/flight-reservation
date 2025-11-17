// src/components/admin/AirportTable.jsx
import React from "react";

const AirportTable = ({ airports, onDelete }) => {
  if (!airports.length)
    return (
      <div className="text-center py-12">
        <i className="fas fa-building-slash text-5xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">No airports found.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-hashtag mr-2"></i>#
            </th>
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-code mr-2"></i>Code
            </th>
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-building mr-2"></i>Name
            </th>
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-city mr-2"></i>City
            </th>
            <th className="p-4 border-b font-semibold">
              <i className="fas fa-globe mr-2"></i>Country
            </th>
            <th className="p-4 border-b text-center font-semibold">
              <i className="fas fa-cog mr-2"></i>Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {airports.map((airport, idx) => (
            <tr
              key={airport.airport_id}
              className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b last:border-none text-gray-800 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <td className="p-4 font-medium">{idx + 1}</td>
              <td className="p-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-bold text-sm">
                  {airport.code}
                </span>
              </td>
              <td className="p-4 font-semibold text-gray-800">{airport.name}</td>
              <td className="p-4">
                <span className="text-gray-600">
                  <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                  {airport.city || 'N/A'}
                </span>
              </td>
              <td className="p-4">
                <span className="text-gray-600">
                  <i className="fas fa-flag mr-2 text-green-500"></i>
                  {airport.country || 'N/A'}
                </span>
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => onDelete(airport.airport_id)}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
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

export default AirportTable;
