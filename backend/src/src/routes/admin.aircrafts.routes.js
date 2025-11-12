const express = require('express');
const controller = require('../controllers/admin.aircrafts.controller');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/', adminMiddleware.requireAdmin, controller.listAircrafts);
router.post('/', adminMiddleware.requireAdmin, controller.createAircraft);
router.patch('/:id', adminMiddleware.requireAdmin, controller.updateAircraft);
router.delete('/:id', adminMiddleware.requireAdmin, controller.deleteAircraft);

module.exports = router;
