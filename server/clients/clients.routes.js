const express = require('express');
const headerData = require('../../middleware/calcHeaderStats');
const sendCli = require('../../middleware/sendClientsList');
const controller = require('./clients.controllers');
const userAuth = require('../../middleware/userAuth');
const wrap = require('../../middleware/errorHandler');

const router = express.Router();

// GET: indexes list of all clients and render client dashboard
router.get('/', userAuth, headerData, wrap(controller.Index));

// GET: gets specific client with relevant info about services and payments 
router.get('/:id', userAuth, headerData, sendCli, wrap(controller.Get));

// GET: gets the new client form
router.get('/new', userAuth, wrap(controller.GetForm));

// POST: creates a new client and saves to user
router.post('/', userAuth, wrap(controller.Create));

// PATCH: updates information about a client
router.patch('/:id', userAuth, wrap(controller.Update));

// DELETE: removes a client from db and user client list
router.delete('/:id', userAuth, wrap(controller.Delete));

// PATCH: adds a service to a client
router.patch('/:id/addService', userAuth, wrap(controller.AddService));

// PATCH: removes a service from client service list
router.patch('/:id/service/:serviceId', userAuth, wrap(controller.RemoveService));

// POST: sends invoice email to client from user
// commented right now b/c dont want to send lots of emails while testing
// router.post('/:id/email', userAuth, wrap(controller.SendMail));

module.exports = router;
