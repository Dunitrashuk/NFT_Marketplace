const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', async (req, res) => {

    //Check if username exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username not found!');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ error: "Invalid Password!" });
    //Create and assign json web token
    const token = jwt.sign({ _id: user._id, username: user.username, funds: user.funds, nfts: user.nfts }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({ username: user.username, token: token });
    process.env.PROCESSED_REQUESTS += 1;
})

module.exports = router;