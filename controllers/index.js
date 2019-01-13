const User = require('../models/user');

module.exports = function(app) {
    //  GET: renders the landing page 
    app.get('/', (req, res) => {
        req.indexPage = true;
        res.render('index', { index: req.indexPage });
    });
}