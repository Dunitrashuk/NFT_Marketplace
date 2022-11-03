const mongoose = require('mongoose');
const Nft = require('./Nft');

const UserSchema = mongoose.Schema({
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