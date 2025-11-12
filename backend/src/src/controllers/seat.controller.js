const seatService = require('../services/seat.service');

exports.listByFlight = async (req, res) => {
	const flightId = req.params.flightId;
	if (!flightId) return res.status(400).json({ status: false, message: 'flightId is required' });

	const seats = await seatService.getSeatsByFlight(flightId);
	res.json({ status: true, seats });
};
