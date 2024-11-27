const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const connectToDb = require('./db.js');
require('dotenv').config();
const cors = require('cors');



const app = express();
app.use(bodyParser.json());

// app.use(cors({
//     origin: 'http://localhost:8080',
// }));


connectToDb();

// const users = require('./routes/users.js')
// app.use('/users', users);

app.listen(process.env.PORT, () => {
    console.log(`Servers en marche sur le port ${process.env.PORT}`)
})