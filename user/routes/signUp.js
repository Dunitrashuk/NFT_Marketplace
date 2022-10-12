const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('Sign Up');
});

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        funds: req.body.funds
    });

    try {
        const savedUser = user.save();
        res.json(savedUser);
    } catch {
        res.json({ message: err });
    }
})

module.exports = router;