require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes/index');
const {
    PORT
} = process.env

app.use(express.json());
app.use('/api', router); // for the route we should use and api

app.use('/', (req, res) => { res.send('Hello This is For Using The Google Authentication') } )

app.listen(PORT, () => { console.log(`listen on port ${PORT}`) });

module.exports = app
