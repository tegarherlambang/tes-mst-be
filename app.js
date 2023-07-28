require('dotenv').config();
const express = require("express");
const moment = require("moment");
const cors = require("cors");
const app = express();
const fs = require('fs')

// ============== End Cronjob ==============
/* Read models */
fs.readdir('./models', async (err, files) => {
    files.forEach((file, i) => {
        import('./models/' + file);
    })
})
var corsOptons = {
    origin: "*"
};
app.use(cors(corsOptons));

global.moment = moment

moment.locale('id');

// parse requests of content-type - application/json

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/uploads'));

const router = require('./routes');
app.use(router)
//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to klapa procurement API" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});