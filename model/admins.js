const speakeasy = require('speakeasy');
const pool = require('./databaseConfig')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');
const config = require('./config.js');

let adminDB = {
    //Admin Login
    adminLogin: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from admins where email=?`;
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
                        return resolve(result);
                    }
                    //If password incorrect
                    return reject(401)
                });
                //Some jwt token stuff to be done
            })
        })
    },

    //Get the temp secret key by admin email
    getSecretByEmail: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select secret_key from admins where email = ?`;
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

    //Validate admin's secret on subsequent login
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

    //Get all admins
    getAdmins: () => {
        return new Promise((resolve, reject) => {
            let sql = `select * from admins`;
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Get admin by id
    getAdminbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `select * from admins where admin_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            })
        })
    },

    //Add admin
    addAdmin: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        values.push(speakeasy.generateSecret().base32)
        return new Promise((resolve, reject) => {
            bcrypt.hash(values[3], saltRounds, (err, hash) => {
                if (err) {
                    console.log(err)
                    return reject(err);
                }
                values[3] = hash
                let sql = `Insert INTO admins(email, first_name, last_name, password, access_right, secret_key) values(?,?,?,?,?,?)`;
                pool.query(sql, values, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                })
            })
        })
    },

    //Update Admin
    updateAdminbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update admins set email=?, first_name=?, last_name=?, access_right=? where admin_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Update Admin password
    updateAdminPwdbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update admins set password=? where admin_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Delete Admin
    deleteAdminbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from admins where admin_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },
}

module.exports = { adminDB };