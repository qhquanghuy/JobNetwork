/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 3rd December 2018 10:16:51 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { idWithLog, clean } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const { createJob } = require('./job-dao')
const { ServerError } = require('./../helper/server-error')
const { secret, userRole } = require('./../helper/constant')
const { prop } = require('ramda')


router.post("/", (req, res) => {
    if (req.user && req.user.role === userRole.employer) {
        req.body.job.userId = req.user.id
        createJob(req.body.job)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => console.log(err))
    } else {
        res.sendStatus(401)
    }
})

module.exports = router;
