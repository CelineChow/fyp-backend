const checkAccess = require('../access/permissions')

let check = {
    //Check if user has permission
    hasPermission: (...role) => {
        return (req, res, next) => {
            let user = req.headers
            console.log("user"+JSON.stringify(user))
            console.log(role)
            if (checkAccess(user, role[0])) {
                next(); // role is allowed, so continue on the next middleware
            } else {
                res.status(403).json({ message: "Forbidden" }); // user is forbidden
            }
        }
    },  

}

module.exports = { check }