const User = require('../users/users.model');
const jwt = require('jsonwebtoken');


/**
 * GetSignUp renders the sign up page view
 */
const GetSignUp = (req, res) => res.render('sign-up')


/**
 * GetSignIn renders the sign in page view
 */
const GetSignIn = (req, res) => res.render('sign-in')

/**
 * SignOut signs out a user by removing cookies
 * redirects user to home page after
 */
const SignOut = (req, res) => {
    res.clearCookie(process.env.COOKIE);
    return res.redirect('/');
}

/**
 * SignUp creates a new user with credentials
 * adds to database and returns a jwt token
 */
const SignUp = async (req, res) => {
    const user = new User(req.body);
    // encrypts password
    user.password = user.generateHash(req.body.password);
    await user.save();
    // returns token for user
    return IssueToken(user, res);
}

/**
 * SignIn checks if correct credentials and signs in
 * existing user which results in returning token
 */
const SignIn = async (req, res) => {
    const User = await User.findOne({ email: req.body.email }).exec();
    // check if there is a user with that email
    if (!user) {
        console.log('No users match inputted credentials');
        res.sendStatus(401);  
    } else if (!user.comparePassword(req.body.password)) {
        console.log('Incorrect credentials');
        res.sendStatus(401);
    } else {
        return IssueToken(user, res);
    }
}

/**
 * IssueToken is called once user is authenitcated and
 * returns a JWT token so user is authorized
 */
const IssueToken = (user, res) => {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
    res.cookie(process.env.COOKIE, token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true }); // maxAge set to 24 hours 
    return res.redirect('/clients');
}

module.exports = {
    SignIn,
    SignOut,
    SignUp,
    GetSignIn,
    GetSignUp,
}
