const express = require('express');
const cors = require('cors');
const app = express();
const proxy = require('express-http-proxy');

app.use(cors());
app.use(express.json());
app.use('/user', proxy('http://localhost:8001'));
app.use('/products', proxy('http://localhost:8002'));

app.listen(8000, () => {
    console.log('Gateway is Listening to port 8000');
})