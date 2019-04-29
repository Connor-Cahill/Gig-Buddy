const Service = require('../models/service');
const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const sendCli = require('../middleware/sendClientsList');
const headerData = require('../middleware/calcHeaderStats');
const userAuth = require('../middleware/userAuth');


module.exports = function(app) {
    //GET: renders list of all user's Services
    app.get('/services', userAuth, sendCli, headerData, wrap(async (req, res) => {
        //below vars are necessary for sending the data displayed in header
        const totalServices = req.totalServices;
        const monthlyServices = req.monthlyServices;
        const oneTimeServices = req.oneTimeServices;
        const totalClients = req.totalClients
        const clients = req.clientList;
        const totalEarned = req.totalEarned;
        //  setting req.serviceIndex for styling purposes
        req.serviceIndex = true;

        const user = await User.findOne({ _id: req.user._id }).populate('services').exec();
        const services = user.services;
        res.render('services-index', { services, totalEarned, clients, totalServices, totalClients, monthlyServices, oneTimeServices, serviceIndex: req.serviceIndex, user: req.user });
    }));

    //POST: creates a new Service LATER: will append to user:
    app.post('/services', userAuth, wrap(async (req, res) => {
        //  creates new service
        const service = new Service(req.body);
        await service.save();
        //  gives new service to the user 
        const user = await User.findOne({ _id: req.user._id }).exec();
        user.services.unshift(service._id);
        await user.save();

        res.redirect('/services');
    }));

    //DELETE: remove & deletes specific Service given Id
    app.delete('/services/:id', userAuth, wrap(async (req, res) => {
        await Service.findOneAndRemove({ _id: req.params.id }).exec();
        const user = await User.findOne({ _id: req.user._id }).exec();
       //   removes the service from the user.services array 
        user.services.pop(user.services.indexOf(req.params.id));
        res.redirect('/services');
    }));

    //put: updates service details
    app.put('/services/:id', userAuth, wrap(async (req, res) => {
        const service = await Service.findOne({ _id: req.params.id }).exec();
        service.set(req.body);
        await service.save();
        res.redirect('/services');
    }));

    

}