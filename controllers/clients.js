const Client = require('../models/client');
const Service = require('../models/service');
const wrap = require('../middleware/errorHandler');
const headerData = require('../middleware/calcHeaderStats');
const sendCli = require('../middleware/sendClientsList');


module.exports = function(app) {

    // // GET: returns list of all clients
    app.get('/clients', headerData, wrap( async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients
        //  setting req.clientIndex for styling purposes
        req.clientIndex = true;

        const clients = await Client.find({}).populate('services').exec();
        res.render('clients-index', { clients, totalServices, monthlyServices, oneTimeServices, totalClients, clientIndex: req.clientIndex });
    }));

    //  GET: renders the clients form and sends service data 
    app.get('/clients/new', wrap(async (req, res) => {
        const services = await Service.find({});
        res.render('client-form', { services });
    }))

    //  GET: returns single client given the ID 
    app.get('/clients/:id', sendCli, wrap( async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients
        const clients = req.clientList;
        const client = await Client.findOne({ _id: req.params.id }).populate('services').exec();
        const services = await Service.find({}).exec();
        res.render('clients-show', { client, services, clients, totalServices, totalClients, monthlyServices, oneTimeServices });
    }))

    
    //  POST: creates a new client --- **LATER** -> need to add user 
    app.post('/clients', wrap( async (req, res) => {
        const client = new Client(req.body);
        await client.save();
        res.redirect(`/clients/${client._id}`);
    }));


    // PUT: edits a client and updates it 
    app.put('/clients/:id', wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        client.set(req.body);
        await client.save();
        res.redirect(`/clients/${client._id}`);
    }));

    // DELETE: removes a client
    app.delete('/clients/:id', wrap(async (req, res) => {
        await Client.findOneAndRemove({ _id: req.params.id }).exec();
        res.redirect('/');
    }));

    //  PATCH: adds services to client 
    app.put('/client/:id', wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        client.services.push(req.body)
        await client.save();
        res.redirect(`/clients/${client._id}`);
    }));

    // PATCH: remove a service from a client
    app.put('/clients/:id/service/:serviceId', wrap(async (req, res) => {
        const client = await Client.findOne({ _id: req.params.id }).exec();
        const service = await Service.findOne({ _id: req.params.serviceId }).exec();
        client.services.pop(indexOf(service));
    }))


}