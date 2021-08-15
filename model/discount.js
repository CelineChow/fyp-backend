const pool = require('./databaseConfig')

let discountDB = {
    //Get discount code by id
    getDiscountbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from discount where discount_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Get discount code by name
    getDiscountbyName: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from discount where discount_code=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Get all discount code
    getDiscounts: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from discount`;
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Add new discount code
    addDiscount: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into discount (discount_name,discount_code,discount_amount,active) values(?,?,?,?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Update discount code
    updateDiscountbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        console.log(values)
        return new Promise((resolve, reject) => {
            let sql = `update discount set discount_name=?, discount_code=?, discount_amount=?, active=? where discount_id=?;`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },

    //Delete discount code
    deleteDiscountbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from discount where discount_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            })
        })
    },
}

module.exports = { discountDB }