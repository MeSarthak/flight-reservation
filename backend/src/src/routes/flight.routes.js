const express = require('express');
const router = express.Router();
const controller = require('../controllers/flight.controller');

router.get('/', controller.list);
router.get('/upcoming', controller.upcoming);
router.get('/:id', controller.get);

module.exports = router;
