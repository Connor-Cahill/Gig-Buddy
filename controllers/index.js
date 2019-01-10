const User = require('../models/user');

module.exports = function(app) {
    //  GET: renders the landing page 
    app.get('/', (req, res) => {
        console.log(req.user);
        res.render('index');
    });
}