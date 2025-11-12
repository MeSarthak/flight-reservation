const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/flights', require('./flight.routes'));
router.use('/seats', require('./seat.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/payments', require('./payment.routes'));

// Admin Panel (admin-only)
router.use('/adminPanel', require('./admin.routes'));

module.exports = router;
