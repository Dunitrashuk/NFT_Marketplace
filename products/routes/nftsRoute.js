const express = require('express');
const router = express.Router();
const Nft = require('../models/Nft');
const User = require('../models/User');
const verify = require('../middlewares/verifyToken');
const cache = require('../middlewares/cache');
const axios = require('axios');
const Redis = require('redis');

const redisClient = Redis.createClient(process.env.REDIS_URL);


// ENDPOINT /nfts
router.get('/', cache, async (req, res) => {
    try {
        const nfts = await Nft.find();
        redisClient.setex("nfts", 600, JSON.stringify(nfts));
        res.json(nfts);
    } catch (err) {
        res.json({ message: err });
    }
    process.env.PROCESSED_REQUESTS += 1;
});


// ENDPOINT /nfts/:id
router.delete("/:id", (req, res) => {
    Nft.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Unable to remove nft from list!" });
        }
        res.json(data);
    });
})

//ENDPOINT /nfts/listNft
router.post('/listNft', verify, async (req, res) => {
    let user = await User.findOne({ username: req.headers['username'] });
    let userNft = user.nfts.find((nft) => {
        return nft._id == req.body._id
    });

    let nftsList = await user.nfts.filter(nft => {
        return nft._id.toString() !== req.body._id
    });

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

        const savedNft = await nft.save();

        // save nfts list to cache
        const nfts = await Nft.find();
        redisClient.setex("nfts", 600, JSON.stringify(nfts));

        res.json(savedNft);
    } catch (err) {
        res.status(400).send(err);
    }

    process.env.PROCESSED_REQUESTS += 1;
});

//ENDPOINT /nfts/buyNft
router.get('/buyNft', verify, async (req, res) => {

    let user = await User.findOne({ username: req.headers["username"] });
    let nft = await Nft.findOne({ _id: req.body._id });
    let owner = await User.findOne({ username: nft.owner });
    let userFunds = parseInt(user.funds.split(" ")[0]);
    let nftPrice = parseInt(nft.price);


    //check if user has enough funds
    if (userFunds < nftPrice) {
        res.json({ message: "Not enough funds!" })
    } else if (user.username === owner.username) {
        res.json({ message: "Cannot buy your own NFT!" });
    } else {

        nft.owner = user.username;
        user.nfts.push(nft);
        user.funds = (userFunds - nftPrice) + " ETH";

        if (owner !== null) {

            let ownerFunds = parseInt(owner.funds.split(" ")[0]);
            owner.funds = (ownerFunds + nftPrice) + " ETH";

            //update owner funds
            User.findOneAndUpdate({ username: owner.username }, { funds: owner.funds }, (err, data) => {
                if (err) {
                    res.status(500).json({ message: "Unable to update owner info!" });
                }
            });
        }

        //TASK DISTRIBUTION
        //add nft to user
        axios.patch(`http://gateway:5000/nftsService/users/${user.username}`, { funds: user.funds, nfts: user.nfts });

        //remove nft from nfts list
        await axios.delete(`http://gateway:5000/nftsService/nfts/${req.body._id}`);


        // add updated nfts list to cache
        const nfts = await Nft.find();
        redisClient.setex("nfts", 600, JSON.stringify(nfts));
        res.json(nft);
    }
    process.env.PROCESSED_REQUESTS += 1;
})


module.exports = router;