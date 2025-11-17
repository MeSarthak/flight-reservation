import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const SeatSelection = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/seats/flight/${id}`);
        // debug log so dev can inspect API response when seats are missing
        console.debug('GET /seats/flight', id, res.data);
        const list = res.data.seats || res.data;
        setSeats(list || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSeats();
  }, [id]);

  // helpers to build grid layout from seat_number like '12A'
  const buildGrid = (seatList) => {
    const rows = {};
    const cols = new Set();
    for (const s of seatList) {
      const m = s.seat_number.match(/(\d+)([A-Za-z]+)/);
      const row = m ? Number(m[1]) : 0;
      const col = m ? m[2].toUpperCase() : s.seat_number;
      cols.add(col);
      if (!rows[row]) rows[row] = {};
      rows[row][col] = s;
    }
    const sortedCols = Array.from(cols).sort();
    const sortedRows = Object.keys(rows).map(Number).sort((a,b)=>a-b);
    return { rows, sortedCols, sortedRows };
  };

  const { rows, sortedCols, sortedRows } = buildGrid(seats);

  const toggleSeat = (seat) => {
    if (!seat.available) return;
    const exists = selectedSeats.find((s) => s.seat_id === seat.seat_id);
    if (exists) setSelectedSeats((s) => s.filter((x) => x.seat_id !== seat.seat_id));
    else setSelectedSeats((s) => [...s, seat]);
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) return setError("Please select at least one seat");
    // navigate to payment and pass selected seats
    navigate('/payment', { state: { flight, selectedSeats } });
  };

  if (loading) return <div className="p-6 text-center">Loading seats...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  if (!seats || seats.length === 0) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border text-center">
          <h2 className="text-xl font-semibold mb-4">No seats available</h2>
          <p className="text-sm text-gray-600 mb-4">There are no seats defined for this flight or all seats are unavailable.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-md bg-indigo-600 text-white">Retry</button>
          </div>
          <details className="mt-6 text-left text-xs text-gray-500">
            <summary className="cursor-pointer">Debug: API response preview</summary>
            <pre className="mt-2 overflow-auto max-h-48 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(seats, null, 2)}</pre>
          </details>
        </div>
      </div>
    );
  }

  const bookedCount = seats.filter((s) => !s.available).length;
  const availableCount = seats.filter((s) => s.available).length;
  const totalCount = seats.length || (flight?.total_seats || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-chair text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Select Your Seats</h2>
            </div>
            <p className="text-sm text-gray-600">
              <i className="fas fa-plane mr-2 text-primary-500"></i>
              Flight: {flight?.flight_number || id} — {flight?.departure_code} → {flight?.arrival_code}
            </p>
          </div>
          <div className="flex gap-4 items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border border-blue-200">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-lg font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Available</p>
              <p className="text-lg font-bold text-green-600">{availableCount}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Booked</p>
              <p className="text-lg font-bold text-red-600">{bookedCount}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded-md shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-md shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">Booked</span>
          </div>
        </div>

        {/* Seat Map */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Cabin View</p>
            <div className="w-full h-1 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full"></div>
          </div>
          <div className="overflow-auto flex justify-center">
            <div className="grid gap-3">
              {sortedRows.map((r) => (
                <div key={r} className="flex items-center gap-3 justify-center">
                  <div className="w-10 text-sm font-bold text-gray-700">{r}</div>
                  <div className="flex gap-2">
                    {sortedCols.map((c) => {
                      const s = rows[r] ? rows[r][c] : undefined;
                      if (!s) return <div key={c} className="w-14 h-12"></div>;
                      const isSelected = !!selectedSeats.find(x => x.seat_id === s.seat_id);
                      return (
                        <button
                          key={s.seat_id}
                          onClick={() => toggleSeat(s)}
                          className={`w-14 h-12 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95 shadow-md
                            ${!s.available 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400' 
                              : isSelected 
                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-indigo-700 shadow-lg' 
                                : 'bg-green-100 text-gray-800 hover:bg-green-200 border-2 border-green-300'}`}
                          disabled={!s.available}
                        >
                          {s.seat_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Selected seats: <span className="text-primary-600 text-lg">{selectedSeats.length}</span>
            </p>
            {selectedSeats.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                <i className="fas fa-check-circle text-green-500 mr-1"></i>
                {selectedSeats.map(s => s.seat_number).join(', ')}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back
            </button>
            <button 
              onClick={proceedToPayment} 
              disabled={selectedSeats.length === 0}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <i className="fas fa-credit-card"></i>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
