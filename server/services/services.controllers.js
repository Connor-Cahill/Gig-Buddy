const Service = require('./services.model');
const User = require('../users/users.model');


/**
 * Index returns list of all services
 * and renders service index on dashboard
 */
const Index = async (req, res) => {
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
    return res.render('services-index', { services: user.services, totalEarned, clients, totalServices, totalClients, monthlyServices, oneTimeServices, serviceIndex: req.serviceIndex, user: req.user });
}

/**
 * Create makes a new service and save
 * is to the users services list
 */
const Create = async (req, res) => {
    const service = new Service(req.body);
    await service.save();
    // gives new service to user
    const user = await User.findById(req.user._id).exec();
    user.services.unshift(service._id);
    await user.save();
    return res.redirect('/services');
}


/**
 * Delete removes a services and
 * removes it from the users user.services arr
 */
const Delete = async (req, res) => {
    await Service.findOneAndRemove({ _id: req.params.id }).exec();
    const user = await User.findById(req.user._id).exec();
    // removes service from user.services array
    user.services.pop(user.services.indexOf(req.params.id));
    await user.save();
    return res.redirect('/services');
}

/**
 * Update updates the info for a service
 */
const Update = async (req, res) => {
    const service = await Service.findById(req.params.id).exec();
    // set new info
    service.set(req.body);
    await service.save();
    return res.redirect(req.body);
}
    
module.exports = {
    Index,
    Create,
    Delete,
    Update,
}
