const express = require('express');
const router = express.Router();
const Nft = require('../models/Nft');
const User = require('../models/User');
const verify = require('./verifyToken');
const axios = require('axios');

// ENDPOINT /nfts
router.get('/', verify, async (req, res) => {
    try {
        const nfts = await Nft.find();
        res.json(nfts);
    } catch (err) {
        res.json({ message: err });
    }
});

//ENDPOINT /nfts/listNft
router.post('/listNft', verify, async (req, res) => {

    //place nft in nfts list
    const nft = new Nft({
        name: req.body.name,
        owner: req.body.owner,
        price: req.body.price
    });

    try {
        const savedNft = await nft.save();

        //remove nft from user list
        //???


        // save nfts list to cache
        //???


        res.json(savedNft);
    } catch (err) {
        res.status(400).send(err);
    }
});

//ENDPOINT /nfts/buyNft
router.get('/buyNft', verify, async (req, res) => {
    let funds
    let user = await User.findOne({ username: req.headers["username"] });
    let nft = await Nft.findOne({ _id: req.body._id });
    let owner = await User.findOne({ owner: nft.owner });
    let userFunds = parseInt(user.funds.split(" ")[0]);
    let ownerFunds = parseInt(owner.funds.split(" ")[0]);
    let nftPrice = parseInt(nft.price);


    //check if user has enough funds
    if (userFunds < nftPrice) {
        res.json({ message: "Not enough funds!" })
    } else {

        nft.owner = user.username;
        user.nfts.push(nft);
        user.funds = (userFunds - nftPrice) + " ETH";
        owner.funds = (ownerFunds + nftPrice) + " ETH";

        // add nft to user
        User.findOneAndUpdate({ username: user.username }, { funds: user.funds, nfts: user.nfts }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Unable to update user info!" });
            }
        });

        //update owner funds
        User.findOneAndUpdate({ username: nft.owner }, { funds: owner.funds }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Unable to update owner info!" });
            }
        });

        //remove nft from nfts list
        Nft.findOneAndDelete({ _id: nft._id }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Unable to remove nft from list!" });
            }
            res.json(data);
        });
    }
})

module.exports = router;