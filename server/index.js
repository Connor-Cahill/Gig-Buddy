const User = require('./users/users.model');

module.exports = function(app) {
    //  GET: renders the landing page 
    app.get('/', (req, res) => {
        req.indexPage = true;
        res.render('index', { index: req.indexPage, user: req.user });
    });
}
