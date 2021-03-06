const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const UserSchema = new Schema({
    createdAt: { type: Date, default: Date.now() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: null },
    phoneNumber: { type: String, required: true },
    venmoUsername: { type: String, required: false },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false },
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    openBills: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    paidBills: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    totalEarned: { type: Number, default: 0 },

})

UserSchema.pre('save', (next) => {
    if (this.password === null || this.password === '') {
        console.log('ERROR: User must have password!')
        return next();
    }
    return next();
})

//  Generate Hash For Password
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.comparePassword = function(password, done) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
