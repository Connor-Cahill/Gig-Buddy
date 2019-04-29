const Payment = require('../models/payment');
const Service = require('../models/service');
const Client = require('../models/client');
const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');
const userAuth = require('../middleware/userAuth');
const emailer = require('../services/sendgrid-emailer');

module.exports = function(app) {
    //  GET: returns the payments-index (dashboard to view all payments)
    app.get('/payments', userAuth, sendCli, headerData, wrap(async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients;
        const totalEarned = req.totalEarned;

        //  setting req.paymentsIndex for styling purposes
        req.paymentsIndex = true;

        const user = await User.findById(req.user._id).populate('openBills').populate({ 
            path: 'openBills',
            populate: { 
                path: 'client'
            }}).populate({ 
                path: 'openBills',
                populate: {
                      path: 'service'
                    }}).populate('paidBills').populate({
            path: 'paidBills',
            populate: {
                path: 'client'
            }}).populate({ 
                path: 'paidBills',
                populate: {
                    path: 'service'
    }}).exec();
        const openPayments = user.openBills;
        const closedPayments = user.paidBills;
        //  Below is for the frontend handlebars logic in making sure there are payments (open or closed)
        const allPayments = openPayments.concat(closedPayments);
        res.render('payments-index', { openPayments, totalEarned, allPayments, closedPayments, totalServices, clients: req.clientList, monthlyServices, oneTimeServices, totalClients, paymentsIndex: req.paymentsIndex, user: req.user });
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
        client.openPayments.unshift(payment);
        client.services.pop(client.services.indexOf(service._id));
        client.billedServices.unshift(service._id);
        await client.save();

        //  Saving the payment into the users billingHistory
        const user = await User.findById(req.user._id).exec();
        user.openBills.unshift(payment);
        await user.save();

        //  email middleware function that sends an email From: users email To: clients emails. It takes service amount and asks for that much for the paymeny
        await emailer(user, client, service);
        //  this route is hit via ajax call so just sends status(200) instead of rendering anything
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

        //  remove the payment from db
        await Payment.findOneAndRemove({ _id: paymentId }).exec();
        return res.redirect(`/clients/${ clientId }`);
    }));

    //  put: updates a payment
    app.put('/payments/:id', userAuth, wrap(async (req, res) => {
        const payment = await Payment.findById(req.params.id).exec();

        payment.set(req.body);
        await payment.save();
        return res.redirect('/payments');
    }));

    //  PATCH: changes a Payments paid property from false to true & updates user and client:
    app.patch('/payments/:id', userAuth, wrap(async (req, res) => {
        const payment = await Payment.findById(req.params.id).exec();
        payment.set({ paid: true });
        await payment.save();

        const client = await Client.findById(payment.client).exec();
        client.openPayments.pop(client.openPayments.indexOf(payment._id));
        client.closedPayments.unshift(payment._id);

        //  Also adds value of payment to Total Paid 
        client.totalPaid += payment.amount;
        await client.save();

        // find User so can can delete from openBills and add to paidBills
        const user = await User.findById(req.user._id);
        user.openBills.pop(user.openBills.indexOf(payment._id));
        user.paidBills.unshift(payment._id);

        //  Also adds value of payment to users total Earned
        user.totalEarned += payment.amount;
        await user.save();
        return res.sendStatus(200);
    }));
}
