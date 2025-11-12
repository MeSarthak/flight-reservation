const bookingService = require('../services/booking.service');

exports.create = async (req, res) => {
	const user = req.user;
	const { flight_id, passengers } = req.body;
	if (!flight_id || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
		return res.status(400).json({ status: false, message: 'flight_id and passengers[] required' });
	}

	try {
		const booking = await bookingService.createBooking(user.user_id, flight_id, passengers);
		res.status(201).json({ status: true, booking });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: false, message: 'Failed to create booking' });
	}
};

exports.cancel = async (req, res) => {
	const user = req.user;
	const bookingId = req.params.id;
	try {
		await bookingService.cancelBooking(user.user_id, bookingId);
		res.json({ status: true, message: 'Booking cancelled' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: false, message: err.message || 'Failed to cancel' });
	}
};

// GET /bookings - list bookings for current user
exports.list = async (req, res) => {
	const user = req.user;
	try {
		const bookings = await bookingService.getBookingsByUser(user.user_id);
		res.json({ status: true, bookings });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: false, message: 'Failed to fetch bookings' });
	}
};
