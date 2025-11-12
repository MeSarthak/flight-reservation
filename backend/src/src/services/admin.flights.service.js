const pool = require('../config/db');

exports.createFlight = async (data) => {
  const sql = `INSERT INTO flights (flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, base_fare)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    data.flight_number,
    data.aircraft_id,
    data.departure_airport_id,
    data.arrival_airport_id,
    data.departure_time,
    data.arrival_time,
    data.base_fare
  ];
  const [result] = await pool.execute(sql, params);
  const id = result.insertId;
  const [rows] = await pool.execute('SELECT * FROM flights WHERE flight_id = ?', [id]);
  return rows[0];
};

exports.getFlightById = async (id, opts = {}) => {
  const includeDeleted = opts.includeDeleted === true;
  const sql = `SELECT f.*, a1.name AS departure_airport, a1.code AS departure_code, a2.name AS arrival_airport, a2.code AS arrival_code, ac.total_seats
    FROM flights f
    JOIN airports a1 ON f.departure_airport_id = a1.airport_id
    JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
    JOIN aircrafts ac ON f.aircraft_id = ac.aircraft_id
    WHERE f.flight_id = ? ${includeDeleted ? '' : 'AND COALESCE(f.is_deleted,0) = 0'}`;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

exports.listFlights = async (q = {}) => {
  const page = parseInt(q.page, 10) || 1;
  const limit = Math.min(Number(q.limit) || 20, 200);
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (q.airport_id) {
    where.push('(f.departure_airport_id = ? OR f.arrival_airport_id = ?)');
    params.push(q.airport_id, q.airport_id);
  }

  if (q.airline) {
    where.push('f.airline = ?');
    params.push(q.airline);
  }

  if (q.date) {
    where.push('DATE(f.departure_time) = ?');
    params.push(q.date);
  }

  if (q.min_price) {
    where.push('f.base_fare >= ?');
    params.push(q.min_price);
  }

  if (q.max_price) {
    where.push('f.base_fare <= ?');
    params.push(q.max_price);
  }

  if (q.includeDeleted !== 'true') {
    where.push('COALESCE(f.is_deleted, 0) = 0');
  }

  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const countSql = `SELECT COUNT(*) AS total FROM flights f ${whereSql}`;
  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0]?.total || 0;

  const sql = `
    SELECT f.*, 
           a1.name AS departure_airport, a1.code AS departure_code,
           a2.name AS arrival_airport, a2.code AS arrival_code,
           ac.total_seats
    FROM flights f
    JOIN airports a1 ON f.departure_airport_id = a1.airport_id
    JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
    JOIN aircrafts ac ON f.aircraft_id = ac.aircraft_id
    ${whereSql}
    ORDER BY f.departure_time ASC
    LIMIT ? OFFSET ?
  `;

  // Make sure numeric parameters are valid integers
  const finalParams = [...params, Number(limit), Number(offset)];

  if (Number.isNaN(finalParams[finalParams.length - 1]) || Number.isNaN(finalParams[finalParams.length - 2])) {
    throw new Error("Invalid limit or offset in query parameters");
  }

  console.log("🧩 Final SQL:", sql);
  console.log("🧩 Final Params:", finalParams);

  const [rows] = await pool.query(sql, finalParams);

  return { total, page, limit, flights: rows };
};

exports.updateFlight = async (id, patch) => {
  // For safe updates, if aircraft_id changes check capacity vs existing bookings
  if (patch.aircraft_id) {
    // count booked passengers for this flight
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) AS booked FROM bookings WHERE flight_id = ? AND status = ?',
      [id, 'booked']
    );
    const booked = countRows[0].booked || 0;

    const [acRows] = await pool.execute('SELECT total_seats FROM aircrafts WHERE aircraft_id = ?', [patch.aircraft_id]);
    if (!acRows[0]) throw new Error('Aircraft not found');
    const capacity = acRows[0].total_seats || 0;
    if (capacity < booked) {
      const err = new Error(`New aircraft capacity (${capacity}) is less than already booked passengers (${booked})`);
      err.code = 'CAPACITY_VIOLATION';
      throw err;
    }
  }

  const sets = [];
  const params = [];
  for (const k of Object.keys(patch)) {
    sets.push(`
      ${k} = ?
    `);
    params.push(patch[k]);
  }
  if (sets.length === 0) return this.getFlightById(id, { includeDeleted: true });

  const sql = `UPDATE flights SET ${sets.join(', ')} WHERE flight_id = ?`;
  params.push(id);
  await pool.execute(sql, params);
  return this.getFlightById(id, { includeDeleted: true });
};

exports.deleteFlight = async (id, opts = {}) => {
  const hard = opts.hard === true;
  if (hard) {
    await pool.execute('DELETE FROM flights WHERE flight_id = ?', [id]);
    return;
  }
  await pool.execute('UPDATE flights SET is_deleted = 1 WHERE flight_id = ?', [id]);
};
