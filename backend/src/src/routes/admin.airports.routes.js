const express = require('express');
const controller = require('../controllers/admin.airports.controller');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/', adminMiddleware.requireAdmin, controller.listAirports);
router.post('/', adminMiddleware.requireAdmin, controller.createAirport);
router.patch('/:id', adminMiddleware.requireAdmin, controller.updateAirport);
router.delete('/:id', adminMiddleware.requireAdmin, controller.deleteAirport);

module.exports = router;
