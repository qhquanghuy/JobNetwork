/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 22nd October 2018 11:41:22 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
router.post("/login", (req, res) => {
    console.log(req.body)
    res.send("some thing")
})

router.get("/login", (req, res) => {
    res.send("hello world")

})

module.exports = router;
