const express = require('express');
const router = express.Router();
const controller = require('../controllers/seat.controller');

// List seats for a given flight
router.get('/flight/:flightId', controller.listByFlight);

module.exports = router;
