const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.analytics.controller');

// Analytics endpoints
router.get('/revenue', controller.monthlyRevenue);

module.exports = router;
