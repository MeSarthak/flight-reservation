const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth.requireAuth, controller.create);

module.exports = router;
