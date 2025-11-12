const AircraftService = require('../services/admin.aircrafts.service');

exports.listAircrafts = async (req, res) => {
  try {
    const data = await AircraftService.getAircrafts();
    res.json({ status: true, aircrafts: data });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error fetching aircrafts', error: err.message });
  }
};

exports.createAircraft = async (req, res) => {
  try {
    const { total_seats } = req.body;
    if (!total_seats) return res.status(400).json({ status: false, message: 'total_seats is required' });
    const id = await AircraftService.addAircraft({ total_seats });
    res.status(201).json({ status: true, aircraft_id: id });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error creating aircraft', error: err.message });
  }
};

exports.updateAircraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { total_seats } = req.body;
    await AircraftService.editAircraft(id, { total_seats });
    res.json({ status: true, message: 'Aircraft updated successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error updating aircraft', error: err.message });
  }
};

exports.deleteAircraft = async (req, res) => {
  try {
    const { id } = req.params;
    await AircraftService.removeAircraft(id);
    res.json({ status: true, message: 'Aircraft deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error deleting aircraft', error: err.message });
  }
};
