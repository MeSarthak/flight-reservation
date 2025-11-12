const flightService = require('../services/flight.service');

exports.list = async (req, res) => {
	const q = req.query || {};
	const flights = await flightService.getAllFlights(q);
	res.json({ status: true, flights });
};

exports.get = async (req, res) => {
	const id = req.params.id;
	const flight = await flightService.getFlightById(id);
	if (!flight) return res.status(404).json({ status: false, message: 'Flight not found' });
	res.json({ status: true, flight });
};

exports.upcoming = async (req, res) => {
	try {
		const flights = await flightService.getUpcomingFlights();
		res.json({ status: true, flights });
	} catch (err) {
		console.error('Error fetching upcoming flights:', err);
		res.status(500).json({ status: false, message: 'Internal server error' });
	}
};
