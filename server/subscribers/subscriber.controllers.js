const Subscriber = require('./subscribers/subscribers.model');

const Create = async (req, res) => {
    const sub = new Subscriber(req.body);
    await sub.save();
    return sendStatus(200);
}

module.exports = {
    Create,
}
