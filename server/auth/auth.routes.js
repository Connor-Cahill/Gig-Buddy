const express = require('express');
const controller = require('./auth.controllers');
const wrap = require('../../middleware/errorHandler');

const router = express.Router();

// POST: route signs up a user and issues a cookie
router.post('/sign-up', controller.SignUp);

// POST: route signs in existing user
router.post('/sign-in', controller.SignIn);



