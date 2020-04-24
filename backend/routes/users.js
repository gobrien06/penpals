const express = require('express');
const router = express.Router();
const users = require('../models/users');


router.post('/users', function(req, res) {
    users.insert(req, res);
});

router.post('/users/delete', function(req, res) {
    console.log('adfs');
    users.delete_user(req, res);
});

module.exports = router;