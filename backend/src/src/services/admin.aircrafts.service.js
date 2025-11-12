const AircraftModel = require('../models/aircrafts.model');

exports.getAircrafts = async () => await AircraftModel.getAllAircrafts();
exports.getAircraft = async (id) => await AircraftModel.getAircraftById(id);
exports.addAircraft = async (data) => await AircraftModel.createAircraft(data.total_seats);
exports.editAircraft = async (id, data) => await AircraftModel.updateAircraft(id, data.total_seats);
exports.removeAircraft = async (id) => await AircraftModel.deleteAircraft(id);
