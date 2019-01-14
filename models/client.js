const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema ({
    name: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service'}],
    billedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    openPayments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    closedPayments: [{ type: Schema.Types.ObjectId, ref: 'Payment'}],
    totalPaid: { type: Number, default: 0},
});



module.exports = mongoose.model('Client', ClientSchema);

