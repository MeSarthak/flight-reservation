const authService = require('../services/auth.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'change-me';

exports.register = async (req, res) => {
	const { name, email, phone, password } = req.body;
	// Improved validation: tell the client which fields are missing
	const missing = [];
	if (!name) missing.push('name');
	if (!email) missing.push('email');
	if (!password) missing.push('password');
	if (missing.length > 0) {
		return res.status(400).json({ status: false, message: 'Missing required fields', missing });
	}

	const existing = await authService.getUserByEmail(email);
	if (existing) return res.status(409).json({ status: false, message: 'Email already registered' });

	const hash = await bcrypt.hash(password, 10);
	const user = await authService.createUser({ name, email, phone, password_hash: hash });

	res.status(201).json({ status: true, user: { user_id: user.insertId, name, email, phone } });
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ status: false, message: 'email and password required' });

	const user = await authService.getUserByEmail(email);
	if (!user) return res.status(401).json({ status: false, message: 'Invalid credentials' });

	const ok = await bcrypt.compare(password, user.password_hash);
	if (!ok) return res.status(401).json({ status: false, message: 'Invalid credentials' });

	const token = jwt.sign({ user_id: user.user_id, role: user.role, email: user.email }, SECRET, { expiresIn: '8h' });
	res.json({ status: true, token, user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role } });
};
