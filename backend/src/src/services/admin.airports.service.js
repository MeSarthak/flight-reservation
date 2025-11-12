const AirportModel = require('../models/airports.model');

exports.getAirports = async () => await AirportModel.getAllAirports();
exports.getAirport = async (id) => await AirportModel.getAirportById(id);
exports.addAirport = async (data) =>
  await AirportModel.createAirport(data);
exports.editAirport = async (id, data) =>
  await AirportModel.updateAirport(id, data.airport_name, data.airport_code, data.city, data.country);
exports.removeAirport = async (id) => await AirportModel.deleteAirport(id);
