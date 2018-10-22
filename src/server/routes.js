const express = require('express');
const router = express.Router();

// YOUR API ROUTES HERE

const userRoute = require('./user');

// SAMPLE ROUTE
router.use('/user', userRoute);
module.exports = router;