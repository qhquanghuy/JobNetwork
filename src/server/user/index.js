/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Friday, 21st December 2018 1:38:12 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, getUserProfileById, createCertRequest, checkIssuerMember } = require('./user-dao')
const { getApplicants, createJob, createApplyJob } = require('./../job/job-dao')
const { secret, userRole } = require('./../helper/constant')


router.post("/signup", (req, res) => {
    createUser(req.body)
        .then(user => res.send({token: jwt.sign({id: user.id, email: user.email, role: user.role }, secret) }))
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

router.post("/signin", (req, res) => {
    findUserByEmail(req.body.email, req.body.password)
        .then(([rows]) => {
            if(rows[0]) {
                const data = {
                    token: jwt.sign({id: rows[0].id, email: rows[0].email, role: rows[0].role }, secret),
                    info: rows[0]

                }
                res.send({user: data})
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

//request member of issuer
router.post("/member/request", (req, res) => {
    if (req.user) {
        const data = {
            userId: req.user.id,
            issuerId: req.body.issuerId
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
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
    
})

//request cert
router.post("/certs/:publishedCertId/request", (req, res) => {
    if(req.user && req.body.issuerId !== req.user.id) {
        checkIssuerMember(req.body.issuerId, req.user.id)
            .then(([rows]) => {
                if (rows.length > 0) {
                    return true
                } else {
                    return false
                }
            })
            .then(isMember => {
                if (isMember) {
                    const request = {
                        publishedCertId: req.params.publishedCertId,
                        userId: req.user.id
                    }
                    return createCertRequest(request)
                            .then(() => {
                                res.sendStatus(200)
                            })
                } else {
                    res.status(400).send({error: "user is not member of issuer"})
                }
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
})

//get applicants of a job from employer
router.get("/jobs/:id/applicants", (req, res) => {
    if (req.user && req.user.role === userRole.employer) {
        getApplicants(req.user.id, req.params.id)
            .then(([rows]) => {
                rows.forEach(row => {
                    delete row.password_hash
                });
                res.send({applicants: rows})
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})

    } else {
        res.sendStatus(401)
    }
})


//employer create job
router.post("/jobs", (req, res) => {
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

//user apply a job
router.post("/jobs/:jobId/apply", (req, res) => {
    if (req.user && req.user.role === userRole.user) {
        createApplyJob(req.user.id, req.params.jobId)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
    } else {
        res.sendStatus(401)
    }
})




module.exports = router;
