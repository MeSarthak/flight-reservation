const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/admin.middleware');

// All adminPanel routes require admin
router.use(adminMiddleware.requireAdmin);

router.get('/', (req, res) => res.json({ status: true, message: 'Admin Panel' }));

router.use('/flights', require('./admin.flights.routes'));
router.use('/analytics', require('./admin.analytics.routes'));
router.use('/airports', require('./admin.airports.routes'));
router.use('/aircrafts', require('./admin.aircrafts.routes'));

module.exports = router;
