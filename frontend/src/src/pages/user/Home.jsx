import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AvailableFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const navigate = useNavigate();

  // 🔍 Filter states
  const [search, setSearch] = useState("");
  const [minFare, setMinFare] = useState("");
  const [maxFare, setMaxFare] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Dropdown data
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  // ✈️ Fetch all flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/flights/upcoming");
      if (res.data.status && Array.isArray(res.data.flights)) {
        const fetchedFlights = res.data.flights;
        setFlights(fetchedFlights);
        setFilteredFlights(fetchedFlights);

        // Extract unique source and destination codes for dropdowns
        const uniqueSources = [
          ...new Set(fetchedFlights.map((f) => f.departure_code)),
        ].filter(Boolean);
        const uniqueDestinations = [
          ...new Set(fetchedFlights.map((f) => f.arrival_code)),
        ].filter(Boolean);

        setSourceOptions(uniqueSources);
        setDestinationOptions(uniqueDestinations);
      } else {
        setFlights([]);
        setFilteredFlights([]);
        setSourceOptions([]);
        setDestinationOptions([]);
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // 🧠 Filter Logic
  const handleFilter = () => {
    let filtered = flights;

    if (search.trim() !== "") {
      filtered = filtered.filter((f) =>
        f.flight_number.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (source.trim() !== "") {
      filtered = filtered.filter(
        (f) => f.departure_code?.toLowerCase() === source.toLowerCase()
      );
    }

    if (destination.trim() !== "") {
      filtered = filtered.filter(
        (f) => f.arrival_code?.toLowerCase() === destination.toLowerCase()
      );
    }

    if (date.trim() !== "") {
      const selectedDate = new Date(date).toLocaleDateString("en-GB");
      filtered = filtered.filter((f) => {
        const flightDate = new Date(f.departure_time).toLocaleDateString("en-GB");
        return flightDate === selectedDate;
      });
    }

    if (minFare) {
      filtered = filtered.filter((f) => Number(f.base_fare) >= Number(minFare));
    }

    if (maxFare) {
      filtered = filtered.filter((f) => Number(f.base_fare) <= Number(maxFare));
    }

    setFilteredFlights(filtered);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return <p className="text-center text-gray-500 mt-8 text-lg">Loading flights...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8 text-lg">{error}</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">✈️ Available Flights</h1>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Go to Admin Panel
          </button>
        )}
      </div>

      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-8 bg-white shadow-md p-4 rounded-xl">

        {/* 🏙️ Source Dropdown */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-36"
        >
          <option value="">Source</option>
          {sourceOptions.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {/* 🏙️ Destination Dropdown */}
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-36"
        >
          <option value="">Destination</option>
          {destinationOptions.map((dst) => (
            <option key={dst} value={dst}>
              {dst}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-40"
        />

        <input
          type="number"
          placeholder="Min Fare ₹"
          value={minFare}
          onChange={(e) => setMinFare(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-32"
        />
        <input
          type="number"
          placeholder="Max Fare ₹"
          value={maxFare}
          onChange={(e) => setMaxFare(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-32"
        />

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          Apply
        </button>
      </div>

      {/* 🧾 Flights Display */}
      {filteredFlights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFlights.map((f) => (
            <div
              key={f.flight_id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition text-black"
            >
              <h2 className="text-xl font-semibold mb-1">
                Flight {f.flight_number}
              </h2>
              <p className="text-gray-700">
                <strong>From:</strong> {f.departure_code} →{" "}
                <strong>To:</strong> {f.arrival_code}
              </p>
              <p className="text-gray-700">
                <strong>Departure:</strong> {formatDate(f.departure_time)}
              </p>
              <p className="text-gray-700">
                <strong>Arrival:</strong> {formatDate(f.arrival_time)}
              </p>
              <p className="text-green-600 font-semibold mt-2 text-lg">
                ₹{Number(f.base_fare).toFixed(2)}
              </p>

              {/* 🟢 Book Button - navigate to FlightDetails (passes flight in state) */}
              <button
                onClick={() => navigate(`/flights/${f.flight_id}`, { state: { flight: f } })}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
              >
                Book Flight
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No flights found. Try changing filters.
        </p>
      )}
    </div>
  );
};

export default AvailableFlights;
