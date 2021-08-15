const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const discountDB = require('../model/discount');
const discount = discountDB.discountDB;

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions

//Get discount code by id
app.get('/discountbyid/:discount_id', (req, res) => {
    const data = {
        discount_id: req.params.discount_id
    }
    discount.getDiscountbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

//Get discount code by name
app.get('/discountbyname/:discount_code', (req, res) => {
    const data = {
        discount_code: req.params.discount_code
    }
    discount.getDiscountbyName(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

//Get all discount code
app.get('/discount', (req, res) => {
    discount.getDiscounts()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

//Add new discount code
app.post('/discount', check.hasPermission(action.CREATE_DISCOUNT), (req, res) => {
    const data = {
        discount_name: req.body.discount_name,
        discount_code: req.body.discount_code,
        discount_amount: req.body.discount_amount,
        active: req.body.active
    }
    discount.addDiscount(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

//Update discount code
app.put('/updatediscount', check.hasPermission(action.EDIT_DISCOUNT), (req, res) => {
    const data = {
        discount_name: req.body.discount_name,
        discount_code: req.body.discount_code,
        discount_amount: req.body.discount_amount,
        active: req.body.active,
        discount_id: req.body.discount_id
    }
    discount.updateDiscountbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

//Delete discount code
app.delete('/discount/:discount_id', check.hasPermission(action.DELETE_DISCOUNT),  (req, res) => {
    const data = {
        discount_id: req.params.discount_id
    }
    discount.deleteDiscountbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log("error " + err)
            res.status(500).send(err);
        })
})

module.exports = app