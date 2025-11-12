const express = require('express');
const router = express.Router();
const controller = require('../controllers/booking.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth.requireAuth, controller.create);
router.get('/', auth.requireAuth, controller.list);
router.post('/:id/cancel', auth.requireAuth, controller.cancel);

module.exports = router;
