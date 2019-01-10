const Service = require('../models/service');
const wrap = require('../middleware/errorHandler');
const sendCli = require('../middleware/sendClientsList');


module.exports = function(app) {
    //GET: renders list of all user's Services
    app.get('/services', sendCli, wrap(async (req, res) => {
        const clients = req.clientList;
        const services = await Service.find({}).exec();
        res.render('services-index', { services, clients });
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