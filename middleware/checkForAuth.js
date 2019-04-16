const User = require('../models/user');
const jwt = require('jsonwebtoken');
const wrap = require('./errorHandler');

module.exports = wrap(async (req, res, next) => {
    if (req.cookies.gigToken === undefined || req.cookies.gigToken === null) {
        req.user = null;
        return next();
    } else {
        const token = req.cookies.gigToken;
        const uid = jwt.decode(token, process.env.SECRET)._id;
        const user = await User.findById(uid).exec();
        req.user = user;
        res.locals.user = user;
        return next();
    }
})
