// src/components/admin/AircraftTable.jsx
import React from "react";

const AircraftTable = ({ aircrafts, onEdit, onDelete }) => {
  if (!aircrafts.length)
    return <p className="text-center text-gray-500 mt-8">No aircrafts found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
      <table className="min-w-full text-sm text-black border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            {/* <th className="p-3 border-b">#</th> */}
            <th className="p-3 border-b">Aircraft ID</th>
            <th className="p-3 border-b">Total Seats</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((a, idx) => (
            <tr key={a.aircraft_id} className="hover:bg-gray-50 border-b ">
              {/* <td className="p-3">{idx + 1}</td> */}
              <td className="p-3 font-medium">{a.aircraft_id}</td>
              <td className="p-3">{a.total_seats}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(a.aircraft_id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(a.aircraft_id)}
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

export default AircraftTable;
