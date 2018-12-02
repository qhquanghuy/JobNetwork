/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Sunday, 2nd December 2018 1:08:00 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { idWithLog } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const { getUserProfileById } = require('./../user/user-dao')
const { createIssuerMember } = require('./issuer-dao')
const { ServerError } = require('./../helper/server-error')
const { secret, userRole } = require('./../helper/constant')
const { prop } = require('ramda')

router.post("/verifymember", (req, res) => {
    const encodedData = req.body.encoded
    try {
        const decodedData = jwt.decode(encodedData)
        const requestData = jwt.verify(decodedData.token, secret)
        getUserProfileById(requestData.issuerId)
            .then(([rows]) => {
                if (rows[0]) {
                    const publicKey = rows[0].ecPublicKey
                    jwt.verify(encodedData, publicKey, {algorithms: "ES256"}, (err, data) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(401)
                        } else {
                            console.log(data)
                            createIssuerMember(requestData.issuerId, requestData.userId, data.id)
                                .then((id) => {
                                    console.log(id)
                                    res.send({redirectUrl: "some url"})
                                })
                        }
                    })
                } else {
                    res.sendStatus(404)
                }
            })

    } catch (error) {
        res.sendStatus(401)
    }
    

})
module.exports = router;
