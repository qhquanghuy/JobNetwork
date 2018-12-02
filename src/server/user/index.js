/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Sunday, 2nd December 2018 1:51:32 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { idWithLog } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getUserProfileById } = require('./user-dao')
const { ServerError } = require('./../helper/server-error')
const {secret} = require('./../helper/constant')
const { prop } = require('ramda')

router.get("/", (req, res) => {
    console.log("asdfasdfasd")
    getUserProfileById(req.user.id)
        .then(([rows]) => {
            if (rows[0]) {
                delete rows[0].password_hash
                let userProfile = rows[0]
                userProfile.skills = rows.map(prop('skill_name'))
                res.send(userProfile)
            } else {
                throw ServerError("User is not exist!", 403)
            }
            
        })
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

router.post("/signup", (req, res) => {
    createUser(req.body)
        .then(user => res.send({token: jwt.sign({id: user.id, email: user.email, role: user.role }, secret) }))
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

router.post("/signin", (req, res) => {
    findUserByEmail(req.body.email, req.body.password)
        .then(([rows]) => {
            if(rows[0]) {
                res.send({token: jwt.sign({id: rows[0].id, email: rows[0].email, role: rows[0].role }, secret) })
            } else {
                res.status(401).send({message: "email or password is incorrect!"})
            }
        })
        .catch(err => { 
            if(err.code === 'ER_DUP_ENTRY') {
                res.status(400).send({message: "email's already exist!"})
            } else {
                res.status(500).send({ message: "Server error" })}

            }
        )
})


module.exports = router;
