const pool = require('../config/db');

function genReference() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BR${t}${r}`;
}

exports.createBooking = async (user_id, flight_id, passengers) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const bookingRef = genReference();
    const [bRes] = await conn.execute(
      'INSERT INTO bookings (user_id, flight_id, booking_reference) VALUES (?, ?, ?)',
      [user_id, flight_id, bookingRef]
    );

    const bookingId = bRes.insertId;

    for (const p of passengers) {
      // Transform gender to match database enum
      const genderMap = {
        'Male': 'M',
        'Female': 'F',
        'Other': 'O'
      };
      const gender = genderMap[p.gender] || null;

      await conn.execute(
        'INSERT INTO booking_passengers (booking_id, name, age, gender, seat_id) VALUES (?, ?, ?, ?, ?)',
        [bookingId, p.name, p.age || null, gender, p.seat_id || null]
      );
    }

    await conn.commit();
    return { booking_id: bookingId, booking_reference: bookingRef };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// Fetch bookings for a user along with passenger rows
exports.getBookingsByUser = async (user_id) => {
  const [bookings] = await pool.execute(
    'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_time DESC',
    [user_id]
  );

  if (!bookings || bookings.length === 0) return [];

  const ids = bookings.map((b) => b.booking_id);
  const placeholders = ids.map(() => '?').join(',');

  const [passRows] = await pool.execute(
    `SELECT bp.*, b.flight_id, b.booking_reference FROM booking_passengers bp JOIN bookings b ON bp.booking_id = b.booking_id WHERE bp.booking_id IN (${placeholders})`,
    ids
  );

  const byBooking = {};
  for (const p of passRows) {
    if (!byBooking[p.booking_id]) byBooking[p.booking_id] = [];
    byBooking[p.booking_id].push({
      passenger_id: p.passenger_id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      seat_id: p.seat_id,
    });
  }

  return bookings.map((b) => ({
    booking_id: b.booking_id,
    booking_reference: b.booking_reference,
    flight_id: b.flight_id,
    booking_time: b.booking_time,
    status: b.status,
    passengers: byBooking[b.booking_id] || [],
  }));
};

exports.cancelBooking = async (user_id, booking_id) => {
  // Only allow owner (or later: admin) to cancel
  const [rows] = await pool.execute('SELECT * FROM bookings WHERE booking_id = ?', [booking_id]);
  const booking = rows[0];
  if (!booking) throw new Error('Booking not found');
  if (booking.user_id !== user_id) throw new Error('Not authorized to cancel this booking');

  await pool.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', ['cancelled', booking_id]);
  return true;
};
