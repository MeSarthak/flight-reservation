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

exports.updateUser = async (user_id, { name, email, phone }) => {
	const fields = [];
	const params = [];
	if (name !== undefined) { fields.push('name = ?'); params.push(name); }
	if (email !== undefined) { fields.push('email = ?'); params.push(email); }
	if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
	if (fields.length === 0) return null;
	params.push(user_id);
	const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
	const [result] = await pool.execute(sql, params);
	return result;
};
