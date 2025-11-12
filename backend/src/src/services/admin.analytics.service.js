const pool = require('../config/db');

exports.getMonthlyRevenue = async ({ year }) => {
  // Return month-wise revenue for the provided year (1-12)
  const start = `${year}-01-01 00:00:00`;
  const end = `${year}-12-31 23:59:59`;

  const sql = `SELECT YEAR(p.payment_time) AS year, MONTH(p.payment_time) AS month, SUM(p.amount) AS revenue
    FROM payments p
    JOIN bookings b ON p.booking_id = b.booking_id
    WHERE p.status = 'success' AND p.payment_time BETWEEN ? AND ?
    GROUP BY YEAR(p.payment_time), MONTH(p.payment_time)
    ORDER BY YEAR(p.payment_time), MONTH(p.payment_time)`;

  const [rows] = await pool.execute(sql, [start, end]);

  // Build a full 12-month series with zeros for missing months
  const map = {};
  rows.forEach((r) => {
    map[r.month] = parseFloat(r.revenue) || 0;
  });
  const out = [];
  for (let m = 1; m <= 12; m++) {
    out.push({ month: m, revenue: map[m] || 0 });
  }
  return out;
};
