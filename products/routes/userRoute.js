const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const verify = require('../middlewares/verifyToken');

// ENDPOINT /user
router.get('/', verify, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
    process.env.PROCESSED_REQUESTS += 1;
});


//ENDPOINT /user/addUser
router.post('/addUser', async (req, res) => {

    // Save user in nfts DB
    const user = new User({
        username: req.body.username,
        funds: `${Math.floor(Math.random() * (50 - 1) + 1)} ETH`,
        nfts: []
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(400).send({ error: err });
    }
    process.env.PROCESSED_REQUESTS += 1;
});

router.patch('/:username', async (req, res) => {
    User.findOneAndUpdate({ username: req.params.username }, { funds: req.body.funds, nfts: req.body.nfts }, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Unable to update user info!" });
        }
    });
})


module.exports = router;