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
    process.env.PROCESSED_REQUESTS += 1;
});

//ENDPOINT /nfts/listNft
router.post('/listNft', verify, async (req, res) => {
    let user = await User.findOne({ username: req.headers['username'] });
    let userNft = user.nfts.find((nft) => {
        return nft._id == req.body._id
    });

    console.log(typeof user.nfts[0]._id.toString());
    console.log(typeof req.body._id);

    let nftsList = await user.nfts.filter(nft => {
        return nft._id.toString() !== req.body._id
    });

    console.log(nftsList);


    //place nft in nfts list
    const nft = new Nft({
        name: userNft.name,
        owner: user.username,
        price: req.body.price
    });

    try {
        //remove nft from user list
        User.findOneAndUpdate({ username: user.username }, { nfts: nftsList }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Unable to update nfts list!" });
            }
        });

        // save nfts list to cache
        //???
        const savedNft = await nft.save();

        res.json(savedNft);
    } catch (err) {
        res.status(400).send(err);
    }
    process.env.PROCESSED_REQUESTS += 1;
});

//ENDPOINT /nfts/buyNft
router.get('/buyNft', verify, async (req, res) => {

    let funds
    let user = await User.findOne({ username: req.headers["username"] });
    let nft = await Nft.findOne({ _id: req.body._id });
    let owner = await User.findOne({ username: nft.owner });
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


        if (owner !== null) {
            //update owner funds
            User.findOneAndUpdate({ username: owner.username }, { funds: owner.funds }, (err, data) => {
                if (err) {
                    res.status(500).json({ message: "Unable to update owner info!" });
                }
            });
        }

        // add nft to user
        User.findOneAndUpdate({ username: user.username }, { funds: user.funds, nfts: user.nfts }, (err, data) => {
            if (err) {
                res.status(500).json({ message: "Unable to update user info!" });
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
    process.env.PROCESSED_REQUESTS += 1;
})

module.exports = router;