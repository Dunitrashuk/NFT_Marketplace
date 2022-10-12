const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('User Info');
});

router.get('/:username', async (req, res) => {

    try {
        const user = await User.findById(req.params.username);
        res.json(user);
    } catch (err) {
        res.json(err);
    }

})

module.exports = router;