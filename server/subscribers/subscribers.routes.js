const express = require('express');
const controller = require('./subscribers.subscriber.controllers');
const wrap = require('../../middleware/errorHandler');

const router = express.Router();


// POST: creates a new subscriber
router.post('/', wrap(controller.Create));

module.exports = router;
