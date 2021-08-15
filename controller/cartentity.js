const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const cartDB = require('../model/cart');
const cart = cartDB.cartDB
const cartItem = cartDB.cartItemDB

//Cart
//Get cart by user id
app.get('/cart/:user_id', (req, res) => {
    const data = {
        user_id: req.params.user_id
    };
    cart.getCartbyUserId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "User/Cart not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Add cart by user id
app.post('/cart', (req, res) => {
    const data = {
        user_id: req.body.user_id
    };
    cart.addCartbyUserId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete Cart by User id
app.delete('/cart/:user_id', (req, res) => {
    const data = {
        user_id: req.params.user_id
    };
    cart.deleteCartbyUserId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Cart Item
//Get cart items by cart id
app.get('/cartitem/:cart_id', (req, res) => {
    const data = {
        cart_id: req.params.cart_id
    };
    cartItem.getCartItembyCartId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("User/Cart not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get cart items by user id
app.get('/cartuser/:user_id', (req, res) => {
    const data = {
        user_id: req.params.user_id
    };
    cartItem.getCartItembyUserId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Cart items not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Add cart item by cart id
app.post('/cartitem', (req, res) => {
    const data = {
        cart_id: req.body.cart_id,
        stock_id: req.body.stock_id,
        quantity: req.body.quantity
    };
    cartItem.addCartItembyCartId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update cart item by User id
app.put('/cartitem', (req, res) => {
    const data = {
        stock_id: req.body.stock_id,
        quantity: req.body.quantity,
        cartitem_id: req.body.cartitem_id
    };
    cartItem.updateCartItembyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete cart item by Cart id
app.delete('/cartitem/:cartitem_id', (req, res) => {
    const data = {
        cartitem_id: req.params.cartitem_id
    };
    cartItem.deleteCartItembyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete cart item by Cart id
app.delete('/cartitembycartid/:cart_id', (req, res) => {
    const data = {
        cart_id: req.params.cart_id
    };
    cartItem.deleteCartItembyCartId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

module.exports = app;