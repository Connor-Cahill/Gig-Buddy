const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PaymentSchema = new Schema ({
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    amount: { type: Number },
    client: { type: Schema.Types.ObjectId, ref: 'Client'},
    paid: { type: Boolean, default: false },
});



module.exports = mongoose.model('Payment', PaymentSchema);