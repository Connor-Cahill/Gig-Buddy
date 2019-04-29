const express = require('express');
const wrap = require('../../middleware/errorHandler');
const headerData = require('../../middleware/calcHeaderStats');
const sendCli = require('../../middleware/sendClientsList');
const controller = require('./payments.controllers');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();

// GET: gets payments index which returns all payments
router.get('/', userAuth, sendCli, headerData, wrap(controller.Index));

// POST: creates a new payment
router.post('/clients/:clientId', userAuth, wrap(controller.Create));

// DELETE: removes payment from client and db
router.delete('/:id/clients/:clientId', userAuth, wrap(controller.Delete));

// PATCH: updates information about specific payment 
router.patch('/:id', userAuth, wrap(controller.Update));

// PATCH: closes a payment when client pays 
router.patch('/:id/close', userAuth, wrap(controller.ClosePayment));

module.exports = router;
