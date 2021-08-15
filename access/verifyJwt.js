const jwt = require('jsonwebtoken');
const config = require('../model/config');

verifyJwtToken = (req, res, next) => {
    console.log(req.headers);
    let token = req.headers['authorization']; //retrieve authorization header’s content
    console.log(token);

    if (!token || !token.includes('Bearer')) { //process the token
        res.status(403);
        return res.send({ auth: 'false', message: 'Not authorized!' });
    } else {
        token = token.split('Bearer ')[1]; //obtain the token’s value
        console.log(token);
        jwt.verify(token, config.key, function (err, decoded) {//verify token
            if (err) {
                res.status(403);
                return res.end({ auth: false, message: 'Not authorized!' });
            } else {
                req.user_id = decoded.user_id; //decode the userid and store in req for use
                next();
            }
        });
    }
}

module.exports = verifyJwtToken;
