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
        //  setting req.paymentsIndex for styling purposes
        req.paymentsIndex = true;

        const user = await User.findById(req.user._id).populate('billingHistory').populate({ path: 'billingHistory', populate: { path: 'client'}}).populate({ path: 'billingHistory', populate: { path: 'service'}}).exec();
        const payments = user.billingHistory;
        res.render('payments-index', { payments, totalServices, clients: req.clientList, monthlyServices, oneTimeServices, totalClients, paymentsIndex: req.paymentsIndex, user: req.user });
    }));

    //  POST: creates a new payment and adds it to client 
    app.post('/clients/:clientId/payments', userAuth, wrap(async (req, res) => {
        const payment = new Payment(req.body);
        const clientId = req.params.clientId;
        const service = await Service.findById(payment.service).exec();
        //  setting Payment properties. Amount set equal to cost of service
        payment.client = clientId;
        payment.amount = service.pricing;
        payment.service = service;
        payment.paid = false;
        await payment.save();

        //  Saving the payment to the given client.
        const client = await Client.findById(clientId).exec();
        client.payments.unshift(payment);
        client.services.pop(client.services.indexOf(service._id));
        client.billedServices.unshift(service._id);
        await client.save();

        //  Saving the payment into the users billingHistory
        const user = await User.findById(req.user._id).exec();
        user.billingHistory.unshift(payment);
        await user.save();

        return res.sendStatus(200);
    }));

    //  DELETE: deletes a payment and deletes from client
    app.delete('/clients/:clientId/payments/:id', userAuth, wrap(async (req, res) => {
        const paymentId = req.params.id;
        const clientId = req.params.clientId;
        const client = await Client.findById(clientId).exec();
        //  remove the payment from the client 
        client.payments.pop(client.payments.indexOf(paymentId));
        await client.save();
        //  finally ... remove the payment 
        await Payment.findOneAndRemove({ _id: paymentId }).exec();
        return res.redirect(`/clients/${ clientId }`);
    }));

    //  put: updates a payment
    app.put('/payments/:id', userAuth, wrap(async (req, res) => {
        const payment = await Payment.findById(req.params.id).exec();

        payment.set(req.body);
        await payment.save();
        //  
        return res.redirect('/payments');
    }));
}