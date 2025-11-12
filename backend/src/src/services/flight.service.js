const pool = require('../config/db');

exports.getAllFlights = async (q = {}) => {
  const sql = `SELECT f.*, a1.name AS departure_airport, a1.code AS departure_code, a2.name AS arrival_airport, a2.code AS arrival_code, ac.total_seats
    FROM flights f
    JOIN airports a1 ON f.departure_airport_id = a1.airport_id
    JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
    JOIN aircrafts ac ON f.aircraft_id = ac.aircraft_id`;
  const [rows] = await pool.execute(sql);
  return rows;
};

exports.getFlightById = async (id) => {
  const sql = `SELECT f.*, a1.name AS departure_airport, a1.code AS departure_code, a2.name AS arrival_airport, a2.code AS arrival_code, ac.total_seats
    FROM flights f
    JOIN airports a1 ON f.departure_airport_id = a1.airport_id
    JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
    JOIN aircrafts ac ON f.aircraft_id = ac.aircraft_id
    WHERE f.flight_id = ?`;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

exports.getUpcomingFlights = async () => {
  const sql = `
    SELECT 
      f.*, 
      a1.name AS departure_airport, 
      a1.code AS departure_code, 
      a2.name AS arrival_airport, 
      a2.code AS arrival_code, 
      ac.total_seats
    FROM flights f
    JOIN airports a1 ON f.departure_airport_id = a1.airport_id
    JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
    JOIN aircrafts ac ON f.aircraft_id = ac.aircraft_id
    WHERE 
      f.departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
      AND f.is_deleted = 0
    ORDER BY f.departure_time ASC;
  `;
  const [rows] = await pool.execute(sql);
  return rows;
};
