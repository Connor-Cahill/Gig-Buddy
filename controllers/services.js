const Service = require('../models/service');
const wrap = require('../middleware/errorHandler');
const sendCli = require('../middleware/sendClientsList');
const headerData = require('../middleware/calcHeaderStats');


module.exports = function(app) {
    //GET: renders list of all user's Services
    app.get('/services', sendCli, headerData, wrap(async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients
        const clients = req.clientList;
        //  setting req.serviceIndex for styling purposes
        req.serviceIndex = true;
        const services = await Service.find({}).exec();
        res.render('services-index', { services, clients, totalServices, totalClients, monthlyServices, oneTimeServices, serviceIndex: req.serviceIndex });
    }));

    //POST: creates a new Service LATER: will append to user:
    app.post('/services', wrap(async (req, res) => {
        const service = new Service(req.body);
        await service.save();
        res.redirect('/services');
    }));

    //DELETE: remove & deletes specific Service given Id
    app.delete('/services/:id', wrap(async (req, res) => {
        await Service.findOneAndRemove({ _id: req.params.id }).exec();
        res.redirect('/services');
    }));

    //PUT: updates service details
    app.put('/services/:id', wrap(async (req, res) => {
        const service = await Service.findOne({ _id: req.params.id }).exec();
        service.set(req.body);
        await service.save();
        res.redirect('/services');
    }));

    

}