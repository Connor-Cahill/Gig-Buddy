const express = require('express');
const controller = require('./auth.controllers');
const wrap = require('../../middleware/errorHandler');

const router = express.Router();

// POST: route signs up a user and issues a cookie
router.post('/sign-up', wrap(controller.SignUp));

// POST: route signs in existing user
router.post('/sign-in', wrap(controller.SignIn));

// GET: signs a user out removing jwt token
router.get('/sign-out', wrap(controller.SignOut));

// GET: renders the sign up page
router.get('/sign-up', controller.GetSignUp);

// GET: renders the sign in page
router.get('/sign-in', controller.GetSignIn);

module.exports = router;
