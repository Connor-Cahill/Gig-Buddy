const User = require('../models/user');
const jwt = require('jsonwebtoken');
const wrap = require('../middleware/errorHandler');

module.exports = function(app) {

    //GET: renders signup page
    app.get('/sign-up', (req, res) => {
        res.render('sign-up');
    })

    //GET: renders sign-in page
    app.get('/sign-in', (req, res) => {
        res.render('sign-in');
    })

    //GET (SIGN OUT): signs out the user and clears the cookies 
    app.get('/sign-out', (req, res) => {
        res.clearCookie(process.env.COOKIE);
        res.redirect('/');
        
    })

    //POST: Creates a new user when they sign up 
    app.post('/sign-up', wrap(async (req, res) => {
        const user = new User(req.body);
        user.password = user.generateHash(req.body.password);
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
        res.cookie(process.env.COOKIE, token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true }); // maxAge set to 24 hours 
        res.redirect('/');
    }));


    //POST: Signs user in if credentials are correct
    app.post('/sign-in', wrap(async (req, res) => {
        const user = await User.findOne({ email: req.body.email }, 'email password').exec();
        if(!user) {
            console.log('No account is registered with this email')
            res.sendStatus(401);
        } else if (!user.comparePassword(req.body.password)) {
            console.log('Password is incorrect')
            res.sendStatus(401);
        } else {
            const token = jwt.sign({_id: user._id}, process.env.SECRET, {expiresIn: '60 days'});
            res.cookie(process.env.COOKIE, token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true}); //maxAge = 24 hours
            res.redirect('/');
        }
    }));
}