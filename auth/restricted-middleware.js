const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

module.exports = (req, res, next)=> {
    const [authType, token] = req.headers.authorization.split(" ")
    console.log(token);
    //const secret = "thisisasecret,wehavetokeepitsafe!"
    if (token) {
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
        if (error) {
            console.log(error);
            res.status(401).json({ message: "you shall not pass!" });
        } else {
            req.decodedJwt = decodedToken
            // res.jwt = decodedToken;

            next();
        }
    })
    } else {
        res.status(400).json({ message: "Please provide authentication info"});
    }
};