const mongoose = require("mongoose");
const express = require("express");
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser')
const userInfoRoute = require('./routes/userInfo');
const signUpRoute = require('./routes/signUp');
const getUsersRoute = require('./routes/getUsers')
require("dotenv").config();

app.use(bodyParser.json());

//ENDPOINTS
app.use('/userInfo', userInfoRoute);
app.use('/signUp', signUpRoute);
app.use('/getUsers', getUsersRoute);

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

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`User Service is running on port ${port}`);
})


