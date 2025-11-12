const AirportService = require('../services/admin.airports.service');


exports.listAirports = async (req, res) => {
    try {
        const data = await AirportService.getAirports();
        res.json({ status: true, airports: data });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching airports', error: err.message });
    }
};

exports.createAirport = async (req, res) => {
    try {
        console.log("✈️ Incoming airport data:", req.body);
        const { airport_name, airport_code, city, country } = req.body;
        if (!airport_name || !airport_code) return res.status(400).json({ status: false, message: 'Missing required fields' });

        const id = await AirportService.addAirport({ airport_name, airport_code, city, country });
        res.status(201).json({ status: true, airport_id: id });
    } catch (err) {
        console.error("✈️ Airport Create Error Details:", err);
        res.status(500).json({
            status: false,
            message: "Error creating airport",
            error: err.sqlMessage || err.message,
        });
    }
};

exports.updateAirport = async (req, res) => {
    try {
        const { id } = req.params;
        await AirportService.editAirport(id, req.body);
        res.json({ status: true, message: 'Airport updated successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error updating airport', error: err.message });
    }
};

exports.deleteAirport = async (req, res) => {
    try {
        const { id } = req.params;
        await AirportService.removeAirport(id);
        res.json({ status: true, message: 'Airport deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error deleting airport', error: err.message });
    }
};
