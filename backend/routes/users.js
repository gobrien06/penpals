const express = require('express');
const router = express.Router();
const users = require('../models/users');


router.post('/users', function(req, res) {
    console.log('afdsdafs');
    users.insert(req, res);
});


module.exports = router;