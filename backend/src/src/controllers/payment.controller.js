const paymentService = require('../services/payment.service');

exports.create = async (req, res) => {
	const user = req.user;
	const { booking_id, amount, method } = req.body;
	if (!booking_id || !amount || !method) return res.status(400).json({ status: false, message: 'booking_id, amount and method required' });

	try {
		const payment = await paymentService.createPayment(booking_id, amount, method);
		res.status(201).json({ status: true, payment });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: false, message: 'Payment failed' });
	}
};
