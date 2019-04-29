const Client = require('../models/client');
const Service = require('../models/service');
const User = require('../models/user');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');
const userAuth = require('../middleware/userAuth');
const emailer = require('../services/sendgrid-emailer');


/**
 * Index returns list of all clients 
 * with populated list of services for each
 */
const Index = async (req, res) => {
    //below vars are necessary for sending the data displayed in header
    const totalServices = req.totalServices;
    const monthlyServices = req.monthlyServices;
    const oneTimeServices = req.oneTimeServices;
    const totalClients = req.totalClients;
    const totalEarned = req.totalEarned;
    // setting req.clientIndex for styling purposes
    req.clientIndex = true;
    const user = await User.findOne({ _id: req.user._id }).populate('clients').populate({
        path: 'clients',
        populate: {
            path: 'services',
        }
    }).exec();

    // grab the client list from user
    const clients = user.clients;

    return res.render('clients-index', { clients, totalServices, totalEarned, monthlyServices, oneTimeServices, totalClients, clientIndex: req.clientIndex, user: req.user });
}

/**
 * GetForm renders the new client form
 * with list of services services to add to client
 */
const GetForm = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id }).populate('services').exec();
    return res.render('client-form', { services: user.services });
}

/**
 * Get returns information for single client with 
 * populated and payment history/info
 */
const Get = async (req, res) => {
    //below vars are necessary for sending the data displayed in header
    const totalServices = req.totalServices;
    const monthlyServices = req.monthlyServices;
    const oneTimeServices = req.oneTimeServices;
    const totalClients = req.totalClients
    const clients = req.clientList;
    const totalEarned = req.totalEarned;

    // get the client
    const client = await Client.findOne({ _id: req.params.id })
        .populate('services')
        .populate('openPayments')
        .exec();

    // get current user with services (so user can add services to client)
    const user = await User.findById(req.user._id).populate('services').exec();
    //  getting data for client snapshot
    let totalOwes = 0;
    client.openPayments.forEach((payment) => {
        totalOwes += payment.amount;
    });
    const servicesCompleted = client.billedServices.length || 0;
    return res.render('clients-show', { client, totalOwes, servicesCompleted, totalEarned, services, clients, totalServices, totalClients, monthlyServices, oneTimeServices, user });
}

/**
 * Create makes a new client under a certain user
 * saves to user and as new client in database
 */
const Create = async (req, res) => {
    const client = new Client(req.body);
    await client.save();
    // save to user
    const user = await User.findById(req.user._id).exec();
    user.clients.unshift(client._id);
    await user.save();
    return res.redirect(`/clients/${client._id}`);
}

/**
 * Update edits clients information and saves
 * changes in database
 */
const Update = async (req, res) => {
    const client = await Client.findById(req.params.id).exec();
    // set new info
    client.set(req.body);
    await client.save();
    return res.redirect(`/clients/${client._id}`);
}

/**
 * Delete removes a client from a database and users list of clients
 */
const Delete = async (req, res) => {
    await Client.findOneAndRemove({ _id: req.params.id }).exec(); 
    // get user and remove client from clients list
    const user = User.findById(req.user._id).exec();
    user.clients.pop(user.clients.indexOf(req.params.id));
    await user.save();
    return res.redirect('/clients');
}

/**
 * AddService adds new services to a clientj
 */
const AddService = async (req, res) => {
    const client = await Client.findById(req.params.id).exec();
    // grab services too add from request
    const services = req.body.services;
    // see if services is single value or array of services
    (services.contructor === Array)
        ? services.forEach(service => client.services.unshift(service))
        : client.services.unshift(service);
    await client.save();
    return res.redirect(`/clients/${client._id}`);
}

/**
 * RemoveService removes specific service from a client
 */
const RemoveService = async (req, res) => {
    const client = await Client.findById(req.params.id).exec();
    const service = await Service.findById(req.params.serviceId).exec();
    // remove service from clients service list
    client.service.pop(client.services.indexOf(service))
    return res.sendSatus(200);
}

/**
 * SendMail allows user to send an email invoice to clients
 */
const SendMail = async (req, res) => {
    const client = await Client.findById(req.params.id);
    // get the users and clients email
    const userEmail = req.user.email;
    const clientEmail = client.email;
    return emailer(userEmail, clientEmail, someTemplate)
}

module.exports = {
    Index,
    Get,
    Create,
    Delete,
    Update,
    RemoveService,
    AddService,
    SendMail,
    GetForm,
}
