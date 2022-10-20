const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const signUpRoute = require('./routes/signUp');
const signInRoute = require('./routes/signIn');
const usersRoute = require('./routes/usersRoute');
const statusRoute = require('./routes/statusRoute');

const app = express();
require("dotenv").config();
app.use(bodyParser.json());

//ENDPOINTS
app.use('/signUp', signUpRoute);
app.use('/signIn', signInRoute);
app.use('/users', usersRoute);
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

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`User Service is running on port ${port}`);
})


