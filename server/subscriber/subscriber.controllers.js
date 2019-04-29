const Subscriber = require('../models/subscriber');
const wrap = require('../middleware/errorHandler');

module.exports = function(app) {
    //  POST: posts subscriber to list 
    app.post('/subscribe', wrap(async (req, res) => {
        const sub = new Subscriber(req.body);
        await sub.save();
        return res.sendStatus(200);
    }));
}