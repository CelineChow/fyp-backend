const speakeasy = require('speakeasy');
const pool = require('./databaseConfig')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');
const config = require('./config.js');

let usersDB = {
    //Register a user into the DB
    userRegister: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            bcrypt.hash(values[3], saltRounds, (err, hash) => {
                if (err) {
                    console.log(err)
                    return reject(err);
                }
                values[3] = hash
                let sql = `Insert INTO users(email, first_name, last_name, password, address, postal_code, unit_no, 
                    pcontact_no, scontact_no, secret_key) 
                values (?,?,?,?,?,?,?,?,?,?)`;
                pool.query(sql, values, (error, result) => {
                    if (error) {
                        console.log(error)
                        return reject(error);
                    }
                    resolve(result);
                })
            });
        })
    },

    //Check for any duplicate email
    checkUserEmail: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select email from users where email = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If email is new
                    return resolve(true);
                }
                return resolve(false)
            })
        })
    },

    //Generate token for the first time(Used for verifying users email)
    genToken: (data) => {
        return new Promise((resolve, reject) => {
            if (data == undefined) {
                return reject('Incorrect parameters')
            }
            const token = speakeasy.totp({
                secret: data.temp_secret_key,
                encoding: 'base32',
                step: 60//1 minute
            });
            return resolve(token)
        })
    },

    //Verify user's token for the first time
    verifyToken: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            if (values == undefined) {
                return reject('Incorrect parameters')
            }
            const verified = speakeasy.totp.verify({
                secret: values[0], //The long base32 string
                encoding: 'base32',
                token: values[1], //The 6 digit token
                step: 60 //1 minute
            });
            return resolve(verified)
        })
    },

    //Login
    userLogin: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from users where email = ?`;
            pool.query(sql, values[0], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find user(Email not found)
                    return reject(404);
                }
                bcrypt.compare(values[1], result[0].password, (err, valid) => {
                    if (err) {
                        return reject(err)
                    }
                    if (valid) {
                        token = jwt.sign({ id: result[0].user_id, role: result[0].role },
                            config.key, {
                            expiresIn: 10800//expires in 180 mins
                        });
                        return resolve({jwttoken: token, result: result});
                    }
                    //If password incorrect
                    return reject(401)
                });
                //Some jwt token stuff to be done
            })
        })
    },

    //Get the temp secret key by user email
    getSecretByEmail: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select secret_key from users where email = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find user
                    return reject(404);
                }
                // Generate a 6 digit token from the base32 string
                const token = speakeasy.totp({
                    secret: result[0].secret_key,
                    encoding: 'base32',
                    step: 300//5 minutes
                });
                return resolve(token);
            })
        })
    },

    //Validate user's secret on subsequent login
    validateToken: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            if (values == undefined) {
                return reject("Incorrect parameters")
            }
            const validated = speakeasy.totp.verify({
                secret: values[0], //The long base32 string
                encoding: 'base32',
                token: values[1], //The 6 digit token
                step: 300 //5 minutes
            });
            return resolve(validated)
        })
    },

    //Get user + most recent order
    getUserRecentOrder: () => {
        return new Promise((resolve, reject) => {
            let sql = `select a.*
                    from (select u.*, o.invoice_id, o.created_at order_date, dense_rank() over (
                    partition by u.user_id
                    order by o.created_at desc) order_rank
                    from users u
                    LEFT JOIN orders o ON u.user_id = o.user_id) a
                    where a.order_rank=1`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length == 0) {
                    console.log("No orders found for this user")
                    return reject(404)
                }
                resolve(result);
            })
        })
    },

    //Get user by user id
    getUserById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from users where user_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find user
                    console.log('User not found')
                    return reject(404);
                }
                resolve(result);
            })
        })
    },

    //Update user by user id
    updateUserById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Update users set email=?, first_name=?, last_name=?, address=?, postal_code=?, unit_no=?, 
            pcontact_no=?, scontact_no=? where user_id=?;`;
            pool.query(sql, values, (error, result) => {
                console.log(result)
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                if (result.affectedRows != 1) {
                    //If cannot find user
                    console.log('User not found')
                    return reject(404);
                }
                resolve(result);
            })
        })
    },

    //Update user password by user id
    updateUserpwdById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Update users set password=? where user_id=?;`;
            pool.query(sql, values, (error, result) => {
                console.log(result)
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                if (result.affectedRows != 1) {
                    //If cannot find user
                    console.log('User not found')
                    return reject(404);
                }
                resolve(result);
            })
        })
    },

    //Delete user by user id
    deleteUserById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Delete from users where user_id=?;`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find user
                    console.log('User not found')
                    return reject(404);
                }
                resolve(result);
            })
        })
    }
}


module.exports = { usersDB }