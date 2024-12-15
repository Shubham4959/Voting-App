const mongoose = require('mongoose');
const { formatDate } = require('../helpers/formatDate');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            _id: false,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: formatDate(Date.now())
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
})
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;