const path = require('path');
// load .env so db config works
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const pool = require('../src/config/db');

async function seed(aircraftId) {
  const [rows] = await pool.execute('SELECT total_seats FROM aircrafts WHERE aircraft_id = ?', [aircraftId]);
  const aircraft = rows[0];
  if (!aircraft) {
    console.error('Aircraft not found:', aircraftId);
    process.exit(1);
  }

  const totalSeats = aircraft.total_seats;
  // use 4 seats per row: A,B,C,D
  const cols = ['A','B','C','D'];
  const rowsCount = Math.ceil(totalSeats / cols.length);

  const values = [];
  let counter = 0;
  for (let r = 1; r <= rowsCount; r++) {
    for (let c of cols) {
      counter++;
      if (counter > totalSeats) break;
      const seatNumber = `${r}${c}`;
      values.push([aircraftId, seatNumber, 'economy']);
    }
    if (counter > totalSeats) break;
  }

  if (values.length === 0) {
    console.log('No seats to insert');
    return;
  }

  // Bulk insert
  const placeholders = values.map(() => '(?, ?, ?)').join(',');
  const flat = values.flat();
  const sql = `INSERT INTO seats (aircraft_id, seat_number, seat_class) VALUES ${placeholders}`;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(sql, flat);
    await conn.commit();
    console.log(`Inserted ${values.length} seats for aircraft ${aircraftId}`);
  } catch (err) {
    await conn.rollback();
    console.error('Failed to insert seats', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

const id = Number(process.argv[2]) || 3;
seed(id).catch((e) => { console.error(e); process.exit(1); });
