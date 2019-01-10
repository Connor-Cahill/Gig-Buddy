const Client = require('../models/client');
const wrap = require('./errorHandler');

module.exports = wrap(async (req, res, next) => {
    const clients = await Client.find({});
    req.clientList = clients;
    return next();
    
})