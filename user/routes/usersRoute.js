const express = require('express');
const User = require('../models/User');
const verify = require('./verifyToken');
const router = express.Router();

//ENDPOINT /users
router.get('/', verify, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json(err);
    }
    process.env.PROCESSED_REQUESTS += 1;
})

//ENDPOINT /users/:username
router.get('/:username', verify, async (req, res) => {
    User.findOne({ username: req.params.username }, (err, doc) => {
        if (err)
            res.json({ error: err });
        else {
            res.json(doc)
        }
    });
    process.env.PROCESSED_REQUESTS += 1;
})


module.exports = router;