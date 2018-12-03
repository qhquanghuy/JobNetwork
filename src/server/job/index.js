/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 3rd December 2018 11:07:41 pm
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { createJob, createApplyJob } = require('./job-dao')
const { userRole } = require('./../helper/constant')



router.post("/", (req, res) => {
    if (req.user && req.user.role === userRole.employer) {
        req.body.job.userId = req.user.id
        createJob(req.body.job)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
})


router.post("/", (req, res) => {
    if (req.user && req.user.role === userRole.employer) {
        req.body.job.userId = req.user.id
        createJob(req.body.job)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
})

router.post("/apply", (req, res) => {
    if (req.user && req.user.role === userRole.user) {
        createApplyJob(req.user.id, req.body.jobId)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
})


module.exports = router;
