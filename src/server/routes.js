const express = require('express');
const router = express.Router();

// YOUR API ROUTES HERE

// SAMPLE ROUTE
router.post('/users', (req, res) => {
    console.log(req.body)
    res.json({ username: "Sample" });
});

module.exports = router;