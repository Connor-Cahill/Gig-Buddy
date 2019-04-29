const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
    email: { type: String, required: true },
    subscribed: { type: Boolean, default: true },
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);