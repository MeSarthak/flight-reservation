// src/components/user/FlightFilters.jsx
import React from "react";

const FlightFilters = ({ filters, setFilters, onFilter }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-4 shadow-sm rounded-xl flex flex-wrap items-end gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">Airline</label>
        <input
          type="text"
          name="airline"
          value={filters.airline}
          onChange={handleChange}
          placeholder="e.g., Indigo"
          className="border p-2 rounded-md w-40"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Min Price</label>
        <input
          type="number"
          name="min_price"
          value={filters.min_price}
          onChange={handleChange}
          placeholder="₹"
          className="border p-2 rounded-md w-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Max Price</label>
        <input
          type="number"
          name="max_price"
          value={filters.max_price}
          onChange={handleChange}
          placeholder="₹"
          className="border p-2 rounded-md w-32"
        />
      </div>

      <button
        onClick={onFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
};

export default FlightFilters;
