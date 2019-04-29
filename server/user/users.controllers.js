const User = require('../models/user');
const wrap = require('../middleware/errorHandler');
const userAuth = require('../middleware/userAuth');


module.exports = function(app) {
    // GET: returns JSON list of all users
    app.get('/api/users', userAuth, wrap(async (req, res) => {
        const users = await User.find({}).exec();
        return res.send(users);
    }));

    //  GET: Renders the users profile page 
    app.get('/users/:id', userAuth, wrap(async (req, res) => {
        const user = await User.findById(req.params.id).populate('services').populate('clients').exec();
        return res.render('user-profile', { user });
    }));

    //  PUT: edits user information 
    app.put('/users/:id', userAuth, wrap(async (req, res) => {
        const user = await User.findById(req.params.id).exec();
        user.set(req.body);
        await user.save();
        //  Req is AJAX call so we just return a status 200
        return res.sendStatus(200);
    }));

    //  DELETE: deletes a user from the database
    app.delete('/users/:id', userAuth, wrap(async (req, res) => {
        await User.findOneAndRemove({ _id: req.params.id }).exec();
        //  Don't know if this will render anything so it just returns 200
        return res.sendStatus(200);
    }));
}