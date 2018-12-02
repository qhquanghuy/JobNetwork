/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Sunday, 2nd December 2018 12:30:38 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { idWithLog, clean } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getUserProfileById } = require('./user-dao')
const { ServerError } = require('./../helper/server-error')
const { secret, userRole } = require('./../helper/constant')
const { prop } = require('ramda')

router.get("/", (req, res) => {
    console.log(req)
    getUserProfileById(req.user.id)
        .then(([rows]) => {
            if (rows[0]) {
                delete rows[0].password_hash
                
                let userProfile = rows[0]
                if(rows[0].skill_name) {
                    userProfile.skills = rows.map(prop('skill_name'))
                    
                }

                clean(userProfile)
                delete rows[0].skill_name
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


router.get("/request/issuer/:id", (req, res) => {
    if (req.user) {
        const data = {
            userId: req.user.id,
            issuerId: req.params.id
        }

        getUserProfileById(data.issuerId)
            .then(([rows]) => {
                if (rows[0]) {
                    const user = rows[0]
                    if (user.role === userRole.issuer) {
                        res.send({token: jwt.sign(data, secret)})
                    } else {
                        res.sendStatus(400)
                    }
                } else {
                    res.sendStatus(404)
                }
                
            })
    } else {
        res.sendStatus(401)
    }
    
})


module.exports = router;
