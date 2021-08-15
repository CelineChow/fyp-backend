const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const orderDB = require('../model/orders');
const orders = orderDB.orderDB;
const order_item = orderDB.orderitemDB;

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions
const verifyJwt = require('../access/verifyJwt')

//Orders
//Get order by order id
app.get('/order/:order_id', (req, res) => {
    const data = {
        order_id: req.params.order_id
    }
    orders.getOrderByOrderId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Order not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get all orders
app.get('/orders', check.hasPermission(action.VIEW_ORDERS), (req, res) => {
    orders.getAllOrders()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get all orders by created at, descending order
app.get('/ordersDate', check.hasPermission(action.VIEW_ORDERS),  (req, res) => {
    orders.getAllOrdersByDate()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Add order
app.post('/order', (req, res) => {
    const data = {
        user_id: req.body.user_id,
        invoice_id: req.body.invoice_id,
        delivery_date: req.body.delivery_date,
        delivery_time_range: req.body.delivery_time_range,
        total_amount: req.body.total_amount,
        shipping_address: req.body.shipping_address,
        postal_code: req.body.postal_code,
        status: req.body.status
    }
    orders.addOrder(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update order by order id
app.put('/order', check.hasPermission(action.EDIT_ORDERS), (req, res) => {
    const data = {
        delivery_date: req.body.delivery_date,
        delivery_time_range: req.body.delivery_time_range,
        total_amount: req.body.total_amount,
        shipping_address: req.body.shipping_address,
        postal_code: req.body.postal_code,
        status: req.body.status,
        order_id: req.body.order_id
    }
    orders.updateOrderByOrderId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete order by order id
app.delete('/order', check.hasPermission(action.DELETE_ORDERS), (req, res) => {
    const data = {
        order_id: req.body.order_id
    }
    orders.deleteOrderByOrderId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get all orders + name
app.get('/ordername', check.hasPermission(action.VIEW_ORDERS), (req, res) => {
    orders.getOrderName()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get order by order id + name
app.get('/ordername/:order_id', (req, res) => {
    const data = {
        order_id: req.params.order_id
    }
    orders.getOrderNameByOrderId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Order not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get user order history by id
app.get('/orderhistory/:user_id', verifyJwt, (req, res) => {
    const data = {
        user_id: req.params.user_id
    }
    orders.getOrderHistByUserId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Order history not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Order Items
//Get order item by order item id
app.get('/orderItem/:order_item_id', (req, res) => {
    const data = {
        order_item_id: req.params.order_item_id
    }
    order_item.getOrderItemById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Order item not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get order item by order id
app.get('/itemOrder/:order_id', (req, res) => {
    const data = {
        order_id: req.params.order_id
    }
    order_item.getOrderItemByOrderId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Order item not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get all order items
app.get('/orderItems', (req, res) => {
    order_item.getAllOrderItems()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Add order item
app.post('/orderItem', (req, res) => {
    const data = {
        order_id: req.body.order_id,
        stock_id: req.body.stock_id,
        quantity: req.body.quantity,
        item_price: req.body.item_price
    }
    order_item.addOrderItem(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update order item by order item id
app.put('/orderItem', check.hasPermission(action.EDIT_ORDERS),  (req, res) => {
    const data = {
        stock_id: req.body.stock_id,
        quantity: req.body.quantity,
        item_price: req.body.item_price,
        order_item_id: req.body.order_item_id
    }
    order_item.updateOrderItemById(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete order item by order item id
app.delete('/orderItem', check.hasPermission(action.DELETE_ORDERS),  (req, res) => {
    const data = {
        order_item_id: req.body.order_item_id
    }
    order_item.deleteOrderItemById(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

module.exports = app;