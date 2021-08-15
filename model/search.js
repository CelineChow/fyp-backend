const pool = require('./databaseConfig')

let searchDB = {
    //Search recipes
    searchRecipe: (data) => {
        let values = Object.keys(data).map((key) => '%' + data[key] + '%');
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes where recipe_name like ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Search products
    searchProduct: (data) => {
        let values = Object.keys(data).map((key) => '%' + data[key] + '%');
        return new Promise((resolve, reject) => {
            let sql = `select a.* from(
                select p.*, s.stock_id, s.stock_size, s.stock_price, dense_rank() over (
                partition by p.product_id order by s.stock_price asc) r
                from products p, stock s
                where p.product_id=s.product_id and product_name like ?) a
                where a.r=1`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Search users
    searchUser: (data) => {
        let values = Object.keys(data).map((key) => '%' + data[key] + '%');
        return new Promise((resolve, reject) => {
            let sql = `Select * from users u where concat(u.first_name, ' ', u.last_name) like ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Search admins
    searchAdmin: (data) => {
        let values = Object.keys(data).map((key) => '%' + data[key] + '%');
        return new Promise((resolve, reject) => {
            let sql = `Select * from admins a where concat(a.first_name, ' ', a.last_name) like ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },
}

module.exports = { searchDB }