
//  function checks if user is logged in... if not redirects to homepage
module.exports = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        console.log('User must be signed in to do that');
        return res.redirect('/');
    }
}