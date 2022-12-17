const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

function cache(req, res, next) {

    client.get("nfts", (err, data) => {
        if (err) throw err;

        if (data !== null) {
            console.log("Cache Hit");
            res.json(JSON.parse(data));
        } else next();
    })
}

module.exports = cache;