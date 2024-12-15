const mongoose = require('mongoose');
const { formatDate } = require("../helpers/formatDate")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: formatDate(new Date())
    }

});

const users = mongoose.model("user", userSchema);
module.exports = users


