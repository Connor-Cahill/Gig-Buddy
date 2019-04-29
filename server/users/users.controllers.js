const User = require('./users.model');


//TODO: pass userAuth as middleware
/**
 * Index returns array of json user objects
 */
const Index = async (req, res) => {
    const users = await User.find({}).exec();
    return res.send(users);
}

// TODO: pass userAuth
/**
 * Get renders profile for specific users
 */
const Get = async (req, res) => {
    const user = await User.findById(req.params.id)
        .populate('services')
        .populate('clients')
        .exec();
    // render the users profile
    return res.render('user-profile', { user });
}

// TODO: pass userAuth as middleware
/**
 * Update changes and saves new info to user
 */
const Update = async (req, res) => {
    const user = await User.findById(req.params.id).exec();
    // set new information
    user.set(req.body);
    await user.save();
    return res.sendStatus(200);
}

    //  DELETE: deletes a user from the database
    app.delete('/users/:id', userAuth, wrap(async (req, res) => {
        await User.findOneAndRemove({ _id: req.params.id }).exec();
        //  Don't know if this will render anything so it just returns 200
        return res.sendStatus(200);
    }));

// TODO: pass userAuth middleware
/**
 * Delete removes a user from the database
 */
const Delete = async (req, res) => {
    await User.findOneAndRemove({ _id: req.params.id }).exec();
    return res.sendStatus(200);
}


module.exports = {
    Index,
    Get,
    Update,
    Delete,
}
