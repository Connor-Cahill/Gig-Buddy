const express = require('express');
const wrap = require('../../middleware/errorHandler');
const sendCli = require('../../middleware/sendClientsList');
const controller = require('./services.controllers');
const headerData = require('../../middleware/calcHeaderStats');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();

// GET: indexes all services and renders service dashboard
router.get('/', userAuth, headerData, sendCli, wrap(controller.Index));

// POST: creates a new service and adds to user
router.post('/', userAuth, wrap(controller.Create));

// PATCH: updates service information
router.patch('/:id', userAuth, wrap(controller.Update));

// DELETE: removes sepecific service from users service list
router.delete('/:id', userAuth, wrap(controller.Delete));

module.exports = router;
