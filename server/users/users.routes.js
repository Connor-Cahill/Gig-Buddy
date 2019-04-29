const express = require('express');
const userAuth = require('../../middleware/userAuth');
const wrap = require('../../middleware/errorHandler');
const controller = require('./users.controllers');

const router = express.Router();

// GET: returns array of user objects as json
router.get('/', userAuth, wrap(controller.Index));

// GET: renders user profile with user id as query param
router.get('/:id', userAuth, wrap(controller.Get));

// PATCH: updates users information
router.patch('/:id', userAuth, wrap(controller.Update));

// DELETE: removes a user from database
router.delete('/:id', userAuth, wrap(controller.Delete));

module.exports = router;
