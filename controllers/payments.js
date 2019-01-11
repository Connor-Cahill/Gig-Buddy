const Payment = require('../models/payment');
const Service = require('../models/service');
const Client = require('../models/client');
const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');
const userAuth = require('../middleware/userAuth');

module.exports = function(app) {
    //  GET: returns the payments-index (dashboard to view all payments)
    app.get('/payments', userAuth, sendCli, headerData, wrap(async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients;
        //  setting req.clientIndex for styling purposes
        req.clientIndex = true;

        const user = await User.findById(req.user._id).populate('billingHistory').exec();
        const payments = user.billingHistory;
        res.render('payments-index', { payments, totalServices, monthlyServices, oneTimeServices, totalClients, clientIndex: req.clientIndex, user: req.user });
    }));

    //  POST: creates a new payment and adds it to client 
    app.post('/payments', userAuth, wrap(async (req, res) => {
        const payment = new Payment(req.body);
        const clientId = req.body.client;
        payment.paid = false;
        await payment.save();
        const client = await Client.findById(clientId).exec();
        client.payments.unshift(payment);
        await client.save();
        return res.redirect(`/clients/${ client._id }`);
    }));

    //  DELETE: deletes a payment and deletes from client
    app.delete('/clients/:clientId/payments/:id', userAuth, wrap(async (req, res) => {
        const paymentId = req.params.id;
        const clientId = req.params.clientId;
        const client = await Client.findById(clientId).exec();

        client.payments.pop(indexOf(paymentId));
        await client.save();
        await Payment.findOneAndRemove({ _id: paymentId }).exec();
        return res.redirect(`/clients/${ clientId }`);
    }));

    //  PUT: updates a payment
    app.put('/payments/:id', userAuth, wrap(async (req, res) => {
        const payment = await Payment.findById(req.params.id).exec();
        payment.set(req.body);
        await payment.save();
        return res.redirect(window.history.previous.href);
    }));
}