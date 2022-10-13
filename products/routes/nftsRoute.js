const express = require('express');
const router = express.Router();
const Nft = require('../models/Nft');
const verify = require('./verifyToken');

// ENDPOINT /nfts
router.get('/', verify, async (req, res) => {
    try {
        const nfts = await Nft.find();
        res.json(nfts);
    } catch (err) {
        res.json({ message: err });
    }
});

//ENDPOINT /nfts/sellNft
router.post('/listNft', verify, async (req, res) => {
    const nft = new Nft({
        name: req.body.name,
        owner: req.body.owner,
        price: req.body.price
    });

    try {
        const savedNft = await nft.save();

        res.json(savedNft);
    } catch (err) {
        res.status(400).send(err);
    }
});

//ENDPOINT /nfts/buyNft
router.get('/', async (req, res) => {
    res.send("Buy NFT");
})

module.exports = router;