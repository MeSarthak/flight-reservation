const service = require('../services/admin.flights.service');

const allowedFields = [
  'flight_number',
  'aircraft_id',
  'departure_airport_id',
  'arrival_airport_id',
  'departure_time',
  'arrival_time',
  'base_fare'
];

exports.create = async (req, res) => {
  try {
    const payload = req.body || {};
    // Basic validation
    for (const f of ['flight_number', 'aircraft_id', 'departure_airport_id', 'arrival_airport_id', 'departure_time', 'arrival_time', 'base_fare']) {
      if (!payload[f]) return res.status(400).json({ status: false, message: `${f} is required` });
    }
    const flight = await service.createFlight(payload);
    res.status(201).json({ status: true, flight });
  } catch (err) {
    console.error('admin.flights.create error', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const q = req.query || {};
    const result = await service.listFlights(q);
    res.json({ status: true, ...result });
  } catch (err) {
    console.error('admin.flights.list error', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    const flight = await service.getFlightById(id, { includeDeleted: true });
    if (!flight) return res.status(404).json({ status: false, message: 'Flight not found' });
    res.json({ status: true, flight });
  } catch (err) {
    console.error('admin.flights.get error', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    // Only allow certain fields
    const patch = {};
    for (const k of Object.keys(payload)) {
      if (allowedFields.includes(k)) patch[k] = payload[k];
    }
    if (Object.keys(patch).length === 0) return res.status(400).json({ status: false, message: 'No updatable fields provided' });
    const updated = await service.updateFlight(id, patch);
    res.json({ status: true, flight: updated });
  } catch (err) {
    console.error('admin.flights.update error', err);
    if (err.code === 'CAPACITY_VIOLATION') return res.status(400).json({ status: false, message: err.message });
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const hard = req.query.hard === 'true';
    await service.deleteFlight(id, { hard });
    res.json({ status: true, message: hard ? 'Flight deleted' : 'Flight soft-deleted' });
  } catch (err) {
    console.error('admin.flights.remove error', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
