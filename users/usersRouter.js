const server = require("../api/server.js")

const router = require("express").Router();

const users = require("./usersModel.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, (req,res) => {
    users.find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Something went wrong while retreiving users"})})
});

module.exports = router;