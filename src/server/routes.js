const express = require('express');
const router = express.Router();

// YOUR API ROUTES HERE

const userRoute = require('./user');
const issuerRoute = require('./issuer');
// SAMPLE ROUTE
router.use('/user', userRoute);
router.use('/issuer', issuerRoute);
module.exports = router;