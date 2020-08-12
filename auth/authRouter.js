const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const db = require('../data/db-config.js');
const Users = require('../users/usersModel.js');

router.post('/register', (req,res) => {
    const user = req.body;

    if(user.username && user.password && user.department) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;

        Users.add(user)
            .then(user => {
                res.status(201).json({message: `welcome, ${user.username}`});
            })
            .catch(err => res.status(500).json({ message: "Error registering new user"}));
    } else {
        res.status(400).json({ message: "Missing username, password and/or department"});
    }
});

router.post('/login', (req,res) => {
    const { username, password} = req.body;

    if(username && password) {
        Users.findBy({ username: username })
            .then(user => {
                const token = generateToken(user);
                res.status(200).json({message: `Successful login as ${user.username}, token: ${token}`})
            })
            .catch(err => res.status(500).json({message: "Something went wrong logging in! Might be a server error"}))
    } else {
        res.status(400).json({ message: "Could not match username/password in database"})
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    };
    const options = {
        expiresIn: '1h'
    }
    const secret = secrets.jwtSecret;

    return jwt.sign(payload, secret, options);
}

module.exports = router;


