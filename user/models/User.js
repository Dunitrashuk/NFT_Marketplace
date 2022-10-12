const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    funds: {
        type: String,
        required: true
    },
    "nfts": [
        {
            name: String
        }
    ]
})

module.exports = mongoose.model('User', UserSchema);