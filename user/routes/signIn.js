const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {

    //Check if username exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username not found!');

    //Create and assign json web token
    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({ token: token });

})

module.exports = router;