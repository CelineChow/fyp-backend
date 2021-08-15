const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const DB = require('../model/admins');
let admin = DB.adminDB

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions

//Admin login
app.post('/adminlogin', (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    admin.adminLogin(data)
        .then((result) => {
            console.log(result)
            res.status(201).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 401:
                    res.status(err).send({ err: "Incorrect credentials" });
                    break;
                case 404:
                    res.status(err).send({ err: "Email not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get converted 6 digit token from the base32 string by email
app.get('/adminToken/:email', (req, res) => {
    const data = {
        email: req.params.email,
    }
    admin.getSecretByEmail(data)
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
app.post('/adminValidate', (req, res) => {
    const data = {
        secret_key: req.body.secret_key,
        token: req.body.token,
        email: req.body.email
    }
    admin.validateToken(data)
        .then((result) => {
            console.log(`userValidate: ${result}`)
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`userValidate: ${err}`)
            res.status(500).send(err);
        })
})

//Get all admins
app.get('/admin', (req, res) => {
    admin.getAdmins()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get admin
app.get('/admin/:admin_id', (req, res) => {
    const data = {
        admin_id: req.params.admin_id
    };
    admin.getAdminbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Admin not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Add admin(Register admin account)
app.post('/admin', check.hasPermission(action.CREATE_ADMIN), (req, res) => {
    const data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        access_right: req.body.access_right
    }
    admin.addAdmin(data)
        .then((result) => {
            res.status(201).send({ "adminID: ": result.insertId, "email": data.email });
        }).catch((err) => {
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send({ err: "The new email provided is in use. Please try again." }).end;
            } else {
                res.status(500).send(err);
            }
        })
});

//Update admin
app.put('/admin/:admin_id', check.hasPermission(action.EDIT_ADMIN), (req, res) => {
    const data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        access_right: req.body.access_right,
        admin_id: req.params.admin_id
    }
    admin.updateAdminbyId(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Update admin password
app.put('/adminpwd/:admin_id', (req, res) => {
    const data = {
        password: req.body.password,
        admin_id: req.params.admin_id
    }
    admin.updateAdminPwdbyId(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Delete admin
app.delete('/admin/:admin_id', check.hasPermission(action.DELETE_ADMIN), (req, res) => {
    const data = {
        admin_id: req.params.admin_id
    };
    admin.deleteAdminbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

module.exports = app;