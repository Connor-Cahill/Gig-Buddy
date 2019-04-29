const Payment = require('../models/payment');
const Service = require('../models/service');
const Client = require('../models/client');
const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');
const userAuth = require('../middleware/userAuth');
const emailer = require('../services/sendgrid-emailer');


/**
 * Index renders the payment index with list
 * of all payments for client
 */
const Index = async (req, res) => {
    
    //below vars are necessary for sending the data displayed in header
    const totalServices = req.totalServices;
    const monthlyServices = req.monthlyServices;
    const oneTimeServices = req.oneTimeServices;
    const totalClients = req.totalClients;
    const totalEarned = req.totalEarned;
    // sets payment index for styling purposes
    req.paymentsIndex = true;
    const user = await User.findById(req.user._id) 
        .populate('openBills')
        .populate({
            path: 'openBills',
            populate: {
                path: 'client'
        }})
        .populate({ 
                path: 'openBills',
                populate: {
                      path: 'service'
        }})
        .populate('paidBills').populate({
            path: 'paidBills',
            populate: {
                path: 'client'
        }})
        .populate({ 
            path: 'paidBills',
            populate: {
                path: 'service'
    }}).exec();
    // get open and closed bills from user
    const openPayments = user.openBills;
    const closedPayments = user.paidBills;

    //  Below is for the frontend handlebars logic in making sure there are payments (open or closed)
    const allPayments = openPayments.concat(closedPayments);
    return res.render('payments-index', { openPayments, totalEarned, allPayments, closedPayments, totalServices, clients: req.clientList, monthlyServices, oneTimeServices, totalClients, paymentsIndex: req.paymentsIndex, user: req.user });

}

// TODO: add userAuth as middleware for /:id/payments
/**
 * Create adds a new payment to the data base and saves it to
 * the relevant user and client also adds what services payment is for
 */
const Create = async (req, res) => {
    const payment = new Payment(req.body); 
    const clientId = req.params.clientId;
    const service = await Service.findById(payment.service).exec();

    // setting payment properties
    payment.client = clientId;
    payment.amount = service.pricing;
    payment.service = service;
    payment.paid = false;
    await payment.save();
    // saving payment to client
    const client = await Client.findById(clientId).exec();
    client.openPayments.unshift(payment);
    // popping from services arr to move to billedServices
    client.services.pop(client.services.indexOf(service._id));
    client.billedServices.unshift(service._id);
    await client.save();

    // saving the payment into the users billing history
    const user = await User.findById(req.user._id).exec();
    user.openBills.unshift(payment);
    await user.save();

    // sends email to client that there is new bill
    await emailer(user, client, service);
    return res.sendStatus(200);
}


// TODO: add userAuth as middleware for /:id/clients/:clientId
// TODO: I changes route link fix in frontend
/**
 * Delete removes a payment from client and database
 */
const Delete = async (req, res) => {
    const client = await Client.findById(req.params.clientId).exec();

    // remove payment from client
    client.payments.pop(client.payments.indexOf(req.params.id));
    await client.save();

    // remove payment from db
    await Payment.findOneAndRemove({ _id: req.params.id }).exec();
    return res.redirect(`/clients/${client._id}`);
}

    //  put: updates a payment
    app.put('/payments/:id', userAuth, wrap(async (req, res) => {
        const payment = await Payment.findById(req.params.id).exec();

        payment.set(req.body);
        await payment.save();
        return res.redirect('/payments');
    }));

// TODO: pass userAuth as middleware to /:id/payments
/**
 * Update updates information about a specific payment
 * object
 */
const Update = async (req, res) => {
    const payment = await Payment.findById(req.params.id).exec();
    // set the new info for payment
    payment.set(req.body);
    await payment.save();
    return res.redirect('/payments');
}

// TODO: add userAuth as middleware to /:id
/**
 * ClosePayment changes a payment from open to closed meaning
 * the client paid the bill. 
 */
const ClosePayment = async (req, res) => {
    const payment = await Payment.findById(req.params.id).exec();
    // change paid property to true
    payment.set({ paid: true });
    await payment.save();

    // get client to unshift from openPayments
    // and add to closed payments
    const client = await Client.findById(payment.client).exec();
    client.openPayments.pop(client.openPayments.indexOf(payment._id));
    clients.closedPayments.unshft(payment._id);
    client.totalPaid += payment.amount;
    await client.save();

    const user = await User.findById(req.user._id).exec();
    user.openBills.pop(user.openBills.indexOf(payment._id));
    user.paidBills.unshift(payment._id);
    user.totalEarned += payment.amount;
    await user.save();
    return res.sendStatus(200);
}

module.exports = {
    Index,
    Delete,
    Create,
    Update,
    ClosePayment,
}
