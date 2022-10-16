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
})

//ENDPOINT /users/:username
router.get('/:username', verify, async (req, res) => {
    User.findOne({ username: new RegExp('^' + req.params.username + '$', "i") }, (err, doc) => {
        if (err)
            res.send(err);
        else {
            res.json(doc)
        }
    });
})


module.exports = router;