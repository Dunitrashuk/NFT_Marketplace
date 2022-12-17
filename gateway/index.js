const express = require('express');
const cors = require('cors');
const app = express();
const proxy = require('express-http-proxy');
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/userService', proxy('http://user-service:8000'));
app.use('/nftsService', proxy('http://nfts-service:8002'));

app.listen(process.env.PORT, () => {
    console.log(`Gateway is Listening to port ${process.env.PORT}`)
});
