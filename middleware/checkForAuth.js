const User = require('../models/user');
const jwt = require('jsonwebtoken');
const wrap = require('./errorHandler');

module.exports = wrap(async (req, res, next) => {
    if (req.cookies.Token === undefined || req.cookies.Token === null) {
        req.user = null;
        console.log('null');
        return next();
    } else {
        const token = req.cookies.Token;
        console.log(token)
        const uid = jwt.decode(token, process.env.SECRET)._id;
        const user = await User.findById(uid).exec();
        req.user = user;
        res.locals.user = user;
        console.log('checking user');
        return next();
    }
})