const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const searchDB = require('../model/search');
const search = searchDB.searchDB

//Search recipe
app.get('/searchrecipe/:text', (req, res) => {
    const data = {
        text: req.params.text
    }
    search.searchRecipe(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error: " + err)
            res.status(500).send(err);
        })
})

//Search products
app.get('/searchproduct/:text', (req, res) => {
    const data = {
        text: req.params.text
    }
    search.searchProduct(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error: " + err)
            res.status(500).send(err);
        })
})

//Search users
app.get('/searchuser/:text', (req, res) => {
    const data = {
        text: req.params.text
    }
    search.searchUser(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error: " + err)
            res.status(500).send(err);
        })
})

//Search admins
app.get('/searchadmin/:text', (req, res) => {
    const data = {
        text: req.params.text
    }
    search.searchAdmin(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error: " + err)
            res.status(500).send(err);
        })
})

module.exports = app