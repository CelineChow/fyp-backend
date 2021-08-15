const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const usersDB = require('../model/users')
const users = usersDB.usersDB;

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions
const verifyJwt = require('../access/verifyJwt')
/* ------------------------------------------------------------------------------------------------------------------------- */
//REGISTER
//Add user(Register user account)
app.post('/userRegister', (req, res) => {
    const data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        address: req.body.address,
        postal_code: req.body.postal_code,
        unit_no: req.body.unit_no,
        pcontact_no: req.body.pcontact_no,
        scontact_no: req.body.scontact_no,
        secret_key: req.body.secret_key
    }
    users.userRegister(data)
        .then((result) => {
            console.log(`userRegister: ${JSON.stringify(result)}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`userRegister: ${err}`);
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send({ err: "The new email provided is in use. Please try again." }).end;
            } else {
                res.status(500).send(err);
            }
        })
})

app.get('/checkUseremail/:email', (req, res) => {
    const data = {
        email: req.params.email
    }
    users.checkUserEmail(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Generate token for the first time(Used for verifying user's email)
app.get('/genToken/:temp_secret_key', (req, res) => {
    const data = {
        temp_secret_key: req.params.temp_secret_key
    }
    users.genToken(data)
        .then((result) => {
            console.log(`genToken: ${result}`)
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`genToken: ${err}`)
            res.status(500).send(err);
        })
})

//Verify token for the first time
app.post('/userVerify', (req, res) => {
    const data = {
        temp_secret_key: req.body.temp_secret_key,
        token: req.body.token
    }
    users.verifyToken(data)
        .then((result) => {
            console.log(`userVerify: ${result}`)
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`userVerify: ${err}`)
            res.status(500).send(err);
        })
})
/* ------------------------------------------------------------------------------------------------------------------------- */
//LOGIN
//Login user
app.post('/userLogin', (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
    }
    users.userLogin(data)
        .then((result) => {
            console.log(`userLogin: ${result}`)
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`userLogin: ${err}`)
            switch (err) {
                case 401:
                    res.status(err).send({ err: "Incorrect credentials" });
                    break;
                case 404:
                    res.status(err).send({ err: "Account does not exist" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get converted 6 digit token from the base32 string by email
app.get('/userToken/:email', (req, res) => {
    const data = {
        email: req.params.email,
    }
    users.getSecretByEmail(data)
        .then((result) => {
            console.log(`userToken: ${result}`)
            res.status(200).send({ token: result })
        })
        .catch((err) => {
            console.log(`userToken: ${err}`)
            res.status(500).send(err)
        })
})

//Validate token on subsequent login
app.post('/userValidate', (req, res) => {
    const data = {
        secret_key: req.body.secret_key,
        token: req.body.token,
        email: req.body.email
    }
    users.validateToken(data)
        .then((result) => {
            console.log(`userValidate: ${result}`)
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`userValidate: ${err}`)
            res.status(500).send(err);
        })
})
/* ------------------------------------------------------------------------------------------------------------------------- */
//Get users + most recent order
app.get('/userorder', (req, res) => {
    users.getUserRecentOrder()
        .then((result) => {
            console.log(`userorder: ${result}`)
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`userorder: ${err}`)
            switch (err) {
                case 404:
                    res.status(err).send({ err: "No orders found for this user" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})
/* ------------------------------------------------------------------------------------------------------------------------- */
//Get user by user id
app.get('/user/:user_id', (req, res) => {
    const data = {
        user_id: req.params.user_id
    }
    users.getUserById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`Get user error: ${err}`)
            switch (err) {
                case 404:
                    res.status(err).send({ err: "No user found for this user_id" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Update user by user id
app.put('/user', (req, res) => {
    const data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        postal_code: req.body.postal_code,
        unit_no: req.body.unit_no,
        pcontact_no: req.body.pcontact_no,
        scontact_no: req.body.scontact_no,
        user_id: req.body.user_id
    }
    users.updateUserById(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            console.log(`Update user error: ${err}`)
            switch (err) {
                case 404:
                    res.status(err).send({ err: "No user found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Update user by user id
app.put('/userpwd', (req, res) => {
    const data = {
        password: req.body.password,
        user_id: req.body.user_id
    }
    users.updateUserpwdById(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            console.log(`Update user error: ${err}`)
            switch (err) {
                case 404:
                    res.status(err).send({ err: "No user found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Delete user by user id
app.delete('/user/:user_id', (req, res) => {
    const data = {
        user_id: req.params.user_id
    }
    users.deleteUserById(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            console.log(`Update user error: ${err}`)
            switch (err) {
                case 404:
                    res.status(err).send({ err: "No user found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})
/* ------------------------------------------------------------------------------------------------------------------------- */
module.exports = app;