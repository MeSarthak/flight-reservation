const pool = require('../config/db');

exports.getSeatsByFlight = async (flightId) => {
  // Get aircraft for the flight
  const [frows] = await pool.execute('SELECT aircraft_id FROM flights WHERE flight_id = ?', [flightId]);
  const flight = frows[0];
  if (!flight) return [];

  const [seats] = await pool.execute('SELECT * FROM seats WHERE aircraft_id = ?', [flight.aircraft_id]);

  // find booked seats for the flight
  const [bookedRows] = await pool.execute(
    `SELECT bp.seat_id FROM booking_passengers bp JOIN bookings b ON bp.booking_id = b.booking_id
      WHERE b.flight_id = ? AND b.status = 'booked' AND bp.seat_id IS NOT NULL`,
    [flightId]
  );

  const booked = new Set(bookedRows.map(r => r.seat_id));

  return seats.map(s => ({
    ...s,
    available: !booked.has(s.seat_id)
  }));
};
