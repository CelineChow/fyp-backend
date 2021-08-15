const express = require('express')
require('dotenv').config()
const app = express();
const cors = require('cors');
const path = require('path');
//model files below
const sendemail = require('../model/sendemail');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
//Default landing page of http://localhost:8000, should not matter
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

//API to send email(Experimental, need change in the future)
//Can try testing it in POSTMAN, just remember to change the from and to when using your account
app.post('/sendEmail', (req, res) => {
    const data = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html
    };
    sendemail.sendEmail(data).then((result) => {
        console.log(`app.js for emailing: ${result}`);
        res.status(200).json(result);
    }).catch((err) => {
        console.log(`app.js for emailing: ${err}`);
        res.status(500).json(err);
    })

});

app.use((require('./adminentity')))
app.use((require('./userentity')))
app.use((require('./productentity')))
app.use((require('./recipeentity')))
app.use((require('./orderentity')))
app.use((require('./cartentity')))
app.use((require('./searchentity')))
app.use((require('./discountentity')))

module.exports = app; // DO NOT DELETE