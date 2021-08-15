const pool = require('./databaseConfig')
let orderDB = {
    //Get order by order id
    getOrderByOrderId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from orders where order_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find order
                    //console.log("Order not found");
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Get all orders
    getAllOrders: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from orders`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Get all orders by created at, descending order  
    getAllOrdersByDate: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from orders order by created_at desc`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Add order
    addOrder: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Insert into orders (user_id, invoice_id, delivery_date, delivery_time_range, total_amount, shipping_address, postal_code, status) values (?,?,?,?,?,?,?,?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Update order by order id
    updateOrderByOrderId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Update orders set delivery_date = ?, delivery_time_range = ?, total_amount = ?, shipping_address = ?,
                postal_code = ?, status = ? where order_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Delete order by order id
    deleteOrderByOrderId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Delete from orders where order_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Get all orders + name
    getOrderName: () => {
        return new Promise((resolve, reject) => {
            let sql = `
                    Select o.order_id, u.first_name, u.last_name, o.delivery_date, o.delivery_time_range, o.total_amount, o.postal_code, o.created_at, o.status, o.invoice_id
                    from orders o, users u
                    where o.user_id=u.user_id 
                    order by created_at desc`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Get order by order id + name
    getOrderNameByOrderId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `
                    Select o.status, o.order_id, u.first_name, u.last_name, o.delivery_date, o.delivery_time_range, o.total_amount, o.postal_code, o.created_at, o.shipping_address
                    from orders o, users u
                    where order_id=? and o.user_id=u.user_id`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find order
                    //console.log("Order not found");
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Get order history by user id
    getOrderHistByUserId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from orders where user_id=? order by created_at desc`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length == 0) {
                    console.log(result)
                    //If cannot find order
                    //console.log("Order not found");
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },
}

//Order Items
let orderitemDB = {
    //Get order item by order item id
    getOrderItemById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from order_item where order_item_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find order item
                    //console.log("Order item not found");
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Get order item by order id
    getOrderItemByOrderId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select p.product_name, oi.item_price , oi.order_item_id, o.order_id, s.stock_id, oi.quantity, s.stock_size
            from order_item oi, orders o, stock s, products p 
            where oi.order_id = o.order_id and oi.stock_id = s.stock_id and s.product_id = p.product_id and oi.order_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length < 1) {
                    //If cannot find order item
                    //console.log("Order item not found");
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Get all order items
    getAllOrderItems: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from order_item`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Add order item
    addOrderItem: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Insert into order_item (order_id, stock_id, quantity, item_price) values (?,?,?,?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Update order item by order item id
    updateOrderItemById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Update order_item set stock_id = ?, quantity = ?, item_price = ? where order_item_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Delete order item by order item id
    deleteOrderItemById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Delete from order_item where order_item_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                return resolve(result);
            })
        })
    }

}

module.exports = { orderDB, orderitemDB }