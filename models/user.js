const string = require('@hapi/joi/lib/types/string');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetToken: {
        type: String
    }
})

module.exports = mongoose.model('user', userSchema);