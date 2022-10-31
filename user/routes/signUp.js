const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');


router.post('/', async (req, res) => {

    //Check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send('Username already exists!');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create and save user to DB
    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        // Save user in nfts DB
        axios.post('http://localhost:8000/nftsService/users/addUser', {
            client_id: user._id,
            username: req.body.username
        }).then(() => {
            res.json(savedUser);
        }).catch(err => console.log(err));
    } catch (err) {
        res.status(400).send(err);
    }
    process.env.PROCESSED_REQUESTS += 1;
})

module.exports = router;