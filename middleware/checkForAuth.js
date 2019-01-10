const User = require('../models/user');
const jwt = require('jsonwebtoken');
const wrap = require('./errorHandler');

module.exports = wrap(async (req, res, next) => {
    if (req.cookies.Token) {
        const userId = jwt.decode(req.cookies.Token, process.env.SECRET)._id;
        const user = await User.findById(userId).exec();
        req.user = user;
        return next();
    }
})