const mongoose = require('mongoose');

const NftSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    owner: {
        type: String,
    },

    price: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Nft', NftSchema);