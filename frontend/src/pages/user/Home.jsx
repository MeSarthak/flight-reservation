import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const AvailableFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  // 🚪 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowProfileMenu(false);
    navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white py-8 px-8 ">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-plane text-4xl animate-bounce-slow"></i>
              <h1 className="text-3xl sm:text-4xl font-bold">Available Flights</h1>
            </div>
            <div className="flex gap-3 items-center flex-wrap justify-center">
              <button
                onClick={() => navigate("/my-bookings")}
                className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="fas fa-calendar-check"></i>
                <span className="hidden sm:inline">My Bookings</span>
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}
              
              {/* Profile Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-full hover:bg-white/30 transition-all duration-200 font-semibold shadow-lg"
                >
                  <i className="fas fa-user-circle text-xl"></i>
                  <span className="hidden sm:inline">{user?.name?.split(" ")[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    style={{
                      zIndex: 9999,
                      animation: 'dropdownSlide 0.3s ease-out forwards',
                      transformOrigin: 'top right'
                    }}
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                      <p className="text-sm font-bold">{user?.name}</p>
                      <p className="text-xs text-white/90">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate("/profile"); setShowProfileMenu(false); }}
                      className="w-full text-left px-5 py-3 text-gray-700 hover:bg-primary-50 transition-colors flex items-center gap-3"
                    >
                      <i className="fas fa-user text-primary-600"></i>
                      View Profile
                    </button>
                    <button
                      onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Enhanced Filter Bar */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-8 border border-white/50 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-filter text-primary-600 text-xl"></i>
            <h2 className="text-xl font-bold text-gray-800">Search & Filter</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Source Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <i className="fas fa-map-marker-alt mr-1 text-primary-500"></i>From
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800"
              >
                <option value="">All Sources</option>
                {sourceOptions.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <i className="fas fa-map-marker-alt mr-1 text-secondary-500"></i>To
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all text-gray-800"
              >
                <option value="">All Destinations</option>
                {destinationOptions.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <i className="fas fa-calendar-alt mr-1 text-accent-500"></i>Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-gray-800"
              />
            </div>

            {/* Min Fare */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <i className="fas fa-rupee-sign mr-1 text-green-500"></i>Min Price
              </label>
              <input
                type="number"
                placeholder="₹0"
                value={minFare}
                onChange={(e) => setMinFare(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Max Fare */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <i className="fas fa-rupee-sign mr-1 text-green-500"></i>Max Price
              </label>
              <input
                type="number"
                placeholder="₹99999"
                value={maxFare}
                onChange={(e) => setMaxFare(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-search"></i>
                <span className="hidden sm:inline">Apply</span>
              </button>
            </div>
          </div>
        </div>

        {/* Flights Display */}
        {filteredFlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights.map((f, index) => (
              <div
                key={f.flight_id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Flight Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-plane text-white text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {f.flight_number}
                      </h2>
                      <p className="text-xs text-gray-500">Flight Number</p>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{f.departure_code}</p>
                      <p className="text-xs text-gray-500">{formatDate(f.departure_time)}</p>
                    </div>
                    <div className="flex-1 mx-4 flex items-center">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300"></div>
                      <i className="fas fa-arrow-right text-primary-500 mx-2"></i>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-secondary-300 to-primary-300"></div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{f.arrival_code}</p>
                      <p className="text-xs text-gray-500">{formatDate(f.arrival_time)}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{Number(f.base_fare).toFixed(2)}
                  </p>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => navigate(`/flights/${f.flight_id}`, { state: { flight: f } })}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <i className="fas fa-ticket-alt"></i>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <i className="fas fa-plane-slash text-6xl text-gray-300 mb-4"></i>
            <p className="text-xl font-semibold text-gray-600 mb-2">No flights found</p>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableFlights;
