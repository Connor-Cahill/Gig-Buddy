const express = require('express');
const userRoutes = require('./users/users.routes');
const authRoutes = require('./auth/auth.routes');
const paymentRoutes = require('./payments/payments.routes');
const clientRoutes = require('./clients/clients.routes');
const serviceRoutes = require('./services/services.routes');


const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/clients', clientRoutes);
router.use('/servies', serviceRoutes);


module.exports = router;
