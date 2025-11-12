const pool = require('../config/db');

exports.getUserByEmail = async (email) => {
	const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
	return rows[0];
};

exports.createUser = async ({ name, email, phone, password_hash }) => {
	const [result] = await pool.execute(
		'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
		[name, email, phone || null, password_hash]
	);
	return result; // contains insertId
};

exports.getUserById = async (id) => {
	const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
	return rows[0];
};
