const pool = require('../config/db'); // ensure this points to your MySQL connection pool

exports.createPayment = async (booking_id, amount, method) => {
	try {
		// ✅ Validate allowed payment methods
		const allowedMethods = ['card', 'upi', 'netbanking'];
		if (!allowedMethods.includes(method.toLowerCase())) {
			throw new Error('Invalid payment method');
		}

		// ✅ Default status as "success"
		const status = 'success';

		// ✅ Insert payment record
		const [result] = await pool.query(
			`INSERT INTO payments (booking_id, amount, method, status)
			 VALUES (?, ?, ?, ?)`,
			[booking_id, amount, method, status]
		);

		// ✅ Fetch the inserted payment record
		const [paymentRows] = await pool.query(
			`SELECT * FROM payments WHERE payment_id = ?`,
			[result.insertId]
		);

		// ✅ Return payment object
		return paymentRows[0];
	} catch (error) {
		console.error('Error creating payment:', error.message);
		throw error;
	}
};
