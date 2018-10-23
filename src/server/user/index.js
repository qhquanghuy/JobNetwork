/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Tuesday, 23rd October 2018 10:57:48 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();

const { createUser } = require('./user-dao')

router.post("/signup", (req, res) => {
    createUser(req.body)
        .then(res.send)
        .catch(console.log)
})

module.exports = router;
