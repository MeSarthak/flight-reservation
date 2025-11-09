// src/pages/admin/ManageAirports.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/storage";
import AirportTable from "../../components/admin/AirportTable";

const ManageAirports = () => {
  const [airports, setAirports] = useState([]);
  const [form, setForm] = useState({
    airport_name: "",
    airport_code: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/adminPanel/airports");
      if (res.data.status) setAirports(res.data.airports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      
      await axiosInstance.post("/adminPanel/airports", form);
      setForm({ airport_name: "", airport_code: "", city: "", country: "" });
      fetchAirports();
      alert("Airport added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add airport.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this airport?")) return;
    try {
      await axiosInstance.delete(`/adminPanel/airports/${id}`);
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert("Failed to delete airport.");
    }
  };

  useEffect(() => {
    // If there's no token, redirect to login instead of calling admin APIs
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }

    fetchAirports();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold mb-4 sm:mb-0 text-gray-800"> Manage Airports</h1>
      </div>

      {/* Add Airport Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          name="airport_name"
          placeholder="Airport Name"
          value={form.airport_name}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />
        <input
          name="airport_code"
          placeholder="Code (e.g., DEL)"
          value={form.airport_code}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ➕ Add Airport
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading airports...</p>
      ) : (
        <AirportTable airports={airports} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ManageAirports;
