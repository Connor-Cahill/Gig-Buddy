const Client = require('../models/client');
const Service = require('../models/service');
const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');
const userAuth = require('../middleware/userAuth');
const emailer = require('../services/sendgrid-emailer');

module.exports = function(app) {

    // // GET: returns list of all clients
    app.get('/clients', userAuth, headerData, wrap( async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients;
        //  setting req.clientIndex for styling purposes

        req.clientIndex = true;

        const user = await User.findOne({ _id: req.user._id }).populate('clients').populate({
            path: 'clients',
            populate: {
                path: 'services'
            }
        }).exec();
        const clients = user.clients;
        res.render('clients-index', { clients, totalServices, monthlyServices, oneTimeServices, totalClients, clientIndex: req.clientIndex, user: req.user });
    }));

    //  GET: renders the clients form and sends service data 
    app.get('/clients/new', userAuth, wrap(async (req, res) => {
        const user = await User.findOne({ _id: req.user._id }).populate('services').exec();
        const services = user.services;
        res.render('client-form', { services });
    }));

    //  GET: returns single client given the ID 
    app.get('/clients/:id', userAuth, sendCli, wrap( async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients
        const clients = req.clientList;
        const client = await Client.findOne({ _id: req.params.id }).populate('services').populate('billedServices').exec();
        const user = await User.findById(req.user._id).populate('services').exec();
        const services = user.services;
        res.render('clients-show', { client, services, clients, totalServices, totalClients, monthlyServices, oneTimeServices, user });
    }));

    //  POST: creates a new client
    app.post('/clients', userAuth, wrap( async (req, res) => {
        const client = new Client(req.body);
        await client.save();
        const user = await User.findById(req.user._id).exec();
        user.clients.unshift(client._id);
        await user.save();
        res.redirect(`/clients/${client._id}`);
    }));

    // put: edits a client and updates it 
    app.put('/clients/:id', userAuth, wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        client.set(req.body);
        await client.save();
        res.redirect(`/clients/${client._id}`);
    }));

    // DELETE: removes a client
    app.delete('/clients/:id', userAuth, wrap(async (req, res) => {
        await Client.findOneAndRemove({ _id: req.params.id }).exec();
        const user = await User.findOne({ _id: req.user._id }).exec();
        user.clients.pop(user.clients.indexOf(req.params.id));
        await user.save();
        res.redirect('/clients');
    }));

    //  PUT: adds services to client 
    app.put('/clients/:id/addService', userAuth, wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        const services = req.body.services;
        // See if services is an array or single 
        ((services.constructor === Array) ? services.forEach(function(service) {
            client.services.unshift(service);
        }) : client.services.unshift(services));
        
        await client.save();
        res.redirect(`/clients/${client._id}`);
    }));

    // PUT: remove a service from a client
    app.put('/clients/:id/service/:serviceId', userAuth, wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        const service = await Service.findOne({ _id: req.params.serviceId }).exec();
        client.services.pop(client.services.indexOf(service));
    }));

    //POST: Route allows users to send emails to clients
    app.post('/clients/:id/email', userAuth, wrap(async (req, res) => {
        const client = await Client.findById(req.params.id);
        const userEmail = req.user.email;
        const clientEmail = client.email;
        emailer(userEmail, clientEmail, 'someTemplate')
    }));


}