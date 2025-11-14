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
    <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Select Seats</h2>
            <p className="text-sm text-gray-500 mt-1">Flight: {flight?.flight_number || id} — {flight?.departure_code} → {flight?.arrival_code}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm text-gray-600">Total: <strong>{totalCount}</strong></div>
            <div className="text-sm text-gray-600">Available: <strong>{availableCount}</strong></div>
            <div className="text-sm text-gray-600">Booked: <strong>{bookedCount}</strong></div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded-sm border" />
            <span className="text-xs text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded-sm" />
            <span className="text-xs text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-sm border" />
            <span className="text-xs text-gray-600">Booked</span>
          </div>
        </div>

        <div className="overflow-auto">
          <div className="grid gap-2">
            {sortedRows.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <div className="w-8 text-sm font-medium">{r}</div>
                <div className="flex gap-2">
                  {sortedCols.map((c) => {
                    const s = rows[r] ? rows[r][c] : undefined;
                    if (!s) return <div key={c} className="w-12 h-10"></div>;
                    const isSelected = !!selectedSeats.find(x => x.seat_id === s.seat_id);
                    return (
                      <button
                        key={s.seat_id}
                        onClick={() => toggleSeat(s)}
                        className={`w-12 h-10 rounded-md text-sm font-medium transition flex items-center justify-center
                          ${!s.available ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : isSelected ? 'bg-indigo-600 text-white' : 'bg-green-100 text-gray-800 hover:bg-green-200'}`}
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

        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Selected seats: <strong>{selectedSeats.length}</strong></p>
            {selectedSeats.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{selectedSeats.map(s => s.seat_number).join(', ')}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={proceedToPayment} className="px-4 py-2 rounded-md bg-indigo-600 text-white">Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
