const pool = require('./databaseConfig')
//Cart
let cartDB = {
    //Get Cart by User id
    getCartbyUserId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from cart where user_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length != 1) {
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Add Cart by User id
    addCartbyUserId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into cart (user_id) values (?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Delete Cart by User id
    deleteCartbyUserId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from cart where user_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },
}

//Cart items
let cartItemDB = {
    //Get Cart items by Cart id
    getCartItembyCartId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from cart_item where cart_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length < 1) {
                    return reject(404);
                }
                return resolve(result);
            })
        })
    },

    //Get Cart items by user id
    getCartItembyUserId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `
                    Select ci.quantity, ci.cartitem_id, c.user_id, p.product_img, p.product_name, p.product_desc, 
                    s.stock_id, s.stock_size, s.stock_price
                    from cart_item ci, cart c, stock s, products p
                    where user_id=? and ci.cart_id=c.cart_id and ci.stock_id=s.stock_id and s.product_id=p.product_id`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length < 1) {
                    return reject(404);
                }
                return resolve(result);
            })
        })

    },

    //Add Cart item by cart id
    addCartItembyCartId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into cart_item (cart_id, stock_id, quantity) values (?,?,?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Update Cart item by id
    updateCartItembyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            //Not sure what to do with this
            let sql = `update cart_item set stock_id=?, quantity=? where cartitem_id=?`;
            pool.query(sql, values, (error, result) => {
                console.log(error)
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Delete Cart item by id
    deleteCartItembyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from cart_item where cartitem_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Dete Cart item by Cart Id
    deleteCartItembyCartId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from cart_item where cart_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    }
}

module.exports = { cartDB, cartItemDB }