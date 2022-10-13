const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

// ENDPOINT /user
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});


//ENDPOINT /user/addUser
router.post('/addUser', async (req, res) => {

    // Save user in nfts DB
    const user = new User({
        client_id: req.body.client_id,
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
});

//ENDPOINT /user/:client_id
router.get('/:client_id', async (req, res) => {

})

module.exports = router;