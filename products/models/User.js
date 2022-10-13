const mongoose = require('mongoose');
const Nft = require('./Nft');

const UserSchema = mongoose.Schema({
    client_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    funds: {
        type: String,
        required: true
    },
    nfts: []
})

module.exports = mongoose.model('User', UserSchema);