// src/components/admin/AirportTable.jsx
import React from "react";

const AirportTable = ({ airports, onDelete }) => {
  if (!airports.length)
    return <p className="text-center text-gray-500 mt-8">No airports found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Code</th>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">City</th>
            <th className="p-3 border-b">Country</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {airports.map((airport, idx) => (
            <tr key={airport.airport_id} className="hover:bg-gray-50 border-b text-gray-800 items-center">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3 font-medium">{airport.code}</td>
              <td className="p-3">{airport.name}</td>
              <td className="p-3">{airport.city}</td>
              <td className="p-3">{airport.country}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onDelete(airport.airport_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
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
