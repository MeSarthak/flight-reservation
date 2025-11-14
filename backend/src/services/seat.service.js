const pool = require('../config/db');

exports.getSeatsByFlight = async (flightId) => {
  // Get aircraft for the flight
  const [frows] = await pool.execute('SELECT aircraft_id FROM flights WHERE flight_id = ?', [flightId]);
  const flight = frows[0];
  if (!flight) return [];

  // fetch seats for aircraft
  let [seats] = await pool.execute('SELECT * FROM seats WHERE aircraft_id = ?', [flight.aircraft_id]);

  // If an aircraft has no seats defined, auto-generate seats based on aircraft.total_seats
  if ((!seats || seats.length === 0)) {
    // get total_seats from aircrafts
    const [arows] = await pool.execute('SELECT total_seats FROM aircrafts WHERE aircraft_id = ?', [flight.aircraft_id]);
    const aircraft = arows[0];
    const totalSeats = aircraft ? aircraft.total_seats : 0;

    if (totalSeats && totalSeats > 0) {
      // generate simple seat numbers (rows of 4: A,B,C,D)
      const cols = ['A','B','C','D'];
      const rowsCount = Math.ceil(totalSeats / cols.length);
      const values = [];
      let counter = 0;
      for (let r = 1; r <= rowsCount; r++) {
        for (const c of cols) {
          counter++;
          if (counter > totalSeats) break;
          const seatNumber = `${r}${c}`;
          values.push([flight.aircraft_id, seatNumber, 'economy']);
        }
        if (counter > totalSeats) break;
      }

      if (values.length > 0) {
        const placeholders = values.map(() => '(?, ?, ?)').join(',');
        const flat = values.flat();
        try {
          await pool.execute(`INSERT INTO seats (aircraft_id, seat_number, seat_class) VALUES ${placeholders}`, flat);
        } catch (err) {
          // ignore insert errors (race conditions), we'll re-query seats below
          console.error('Failed to auto-insert seats for aircraft', flight.aircraft_id, err.message || err);
        }
        // re-fetch seats after insertion
        const [newSeats] = await pool.execute('SELECT * FROM seats WHERE aircraft_id = ?', [flight.aircraft_id]);
        seats = newSeats;
      }
    }
  }

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
