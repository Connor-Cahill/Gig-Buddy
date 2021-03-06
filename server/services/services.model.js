const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ServiceSchema = new Schema({
    name: { type: String, required: true },
    pricing: { type: Number, required: true },
    reoccurring: { type: Boolean, required: true },
})




module.exports = mongoose.model('Service', ServiceSchema);