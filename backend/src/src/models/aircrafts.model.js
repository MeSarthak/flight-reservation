const db = require('../config/db');

exports.getAllAircrafts = async () => {
  const [rows] = await db.query('SELECT * FROM aircrafts');
  return rows;
};

exports.getAircraftById = async (id) => {
  const [rows] = await db.query('SELECT * FROM aircrafts WHERE aircraft_id = ?', [id]);
  return rows[0];
};

exports.createAircraft = async (total_seats) => {
  const [result] = await db.query('INSERT INTO aircrafts (total_seats) VALUES (?)', [total_seats]);
  return result.insertId;
};

exports.updateAircraft = async (id, total_seats) => {
  await db.query('UPDATE aircrafts SET total_seats = ? WHERE aircraft_id = ?', [total_seats, id]);
};

exports.deleteAircraft = async (id) => {
  await db.query('DELETE FROM aircrafts WHERE aircraft_id = ?', [id]);
};
