const db = require('../config/db');

exports.getAllAirports = async () => {
  const [rows] = await db.query('SELECT * FROM airports');
  return rows;
};

exports.getAirportById = async (id) => {
  const [rows] = await db.query('SELECT * FROM airports WHERE airport_id = ?', [id]);
  return rows[0];
};

exports.createAirport = async (data) => {
  const { airport_name, airport_code, city, country } = data;

  console.log("🛠 Inserting airport:", airport_name, airport_code, city, country);

  const [result] = await db.query(
    "INSERT INTO airports (name, code, city, country) VALUES (?, ?, ?, ?)",
    [airport_name, airport_code, city, country]
  );

  return result.insertId;
};

exports.updateAirport = async (id, data) => {
  const { airport_name, airport_code, city, country } = data;
  await db.query(
    'UPDATE airports SET name=?, code=?, city=?, country=? WHERE id=?',
    [airport_name, airport_code, city, country, id]
  );
};

exports.deleteAirport = async (id) => {
  await db.query('DELETE FROM airports WHERE airport_id = ?', [id]);
};
