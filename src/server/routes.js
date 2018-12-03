const express = require('express');
const router = express.Router();

// YOUR API ROUTES HERE

const userRoute = require('./user');
const issuerRoute = require('./issuer');
const jobRoute = require('./job');
// SAMPLE ROUTE
router.use('/user', userRoute);
router.use('/issuer', issuerRoute);
router.use('/jobs', jobRoute);
module.exports = router;