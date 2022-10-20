const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const nftsRoute = require('./routes/nftsRoute');
const userRoute = require('./routes/userRoute');
const statusRoute = require('./routes/statusRoute');
const morganBody = require('morgan-body');
let processedRequests

const app = express();
require("dotenv").config();
app.use(bodyParser.json());
morganBody(app);


//ENDPOINTS
app.use('/users', userRoute);
app.use('/nfts', nftsRoute);
app.use('/status', statusRoute);

// DB connection
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB!");
    } catch (error) {
        console.error(error);
    }
}

connect();
app.listen(process.env.PORT, () => {
    console.log(`Product Service is running on port ${process.env.PORT}`);

});