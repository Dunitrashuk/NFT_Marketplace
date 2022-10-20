const express = require('express');
const router = express.Router();

// ENDPOINT /status
router.get('/', async (req, res) => {
    process.env.PROCESSED_REQUESTS += 1;
    try {
        let data = {
            status: "active",
            cpu_usage: process.cpuUsage(),
            processedRequests: process.env.PROCESSED_REQUESTS.length - 1,
            upTime: process.uptime() + "s",
            memory_usage: process.memoryUsage()
        }
        res.status(200).send(data);
    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;