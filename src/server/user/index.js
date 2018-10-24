/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Wednesday, 24th October 2018 10:21:35 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { idWithLog } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const SECRET = "alksdfjlaksdfj"
const { createUser, findUserByEmail } = require('./user-dao')
const { ServerError } = require('./../helper/server-error')




router.post("/", (req, res) => {

        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

router.post("/signup", (req, res) => {
    createUser(req.body)
        .then(user => res.send({token: jwt.sign({id: user.id, email: user.email, role: rows[0].role }, SECRET) }))
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

router.post("/signin", (req, res) => {
    findUserByEmail(req.body.email, req.body.password)
        .then(([rows]) => {
            if(rows[0]) {
                res.send({token: jwt.sign({id: rows[0].id, email: rows[0].email, role: rows[0].role }, SECRET) })
            } else {
                res.status(401).send({message: "email or password is incorrect!"})
            }
        })
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})


module.exports = router;
