const express = require('express')
const app = express();

app.use(express.json());
app.use('/', (req, res, next) => {
    return res.status(200).json({ "msg": "Hello from User" })
})
app.listen(8001, () => {
    console.log('User Service is Listening to port 8001')
})