const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/', async (req, res) => {

    //Check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send('Username already exists!');

    // Create and save user to DB
    const user = new User({
        username: req.body.username,
        funds: req.body.funds,
        nfts: req.body.nfts
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;