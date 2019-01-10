const wrap = require('./errorHandler');
const User = require('../models/user');

module.exports = wrap(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).populate('clients').exec();
    const clients = user.clients;
    req.clientList = clients;
    return next();
})