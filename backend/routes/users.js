const express = require('express');
const router = express.Router();
const users = require('../models/users');
const auth = require('../models/auth');


router.post('/users', function(req, res) {
    users.insert(req, res);
});

router.post('/users/delete', function(req, res) {
    users.delete_user(req, res);
});

router.post('/users/location', function(req, res) {
    users.updateCoords(req, res);    
});

router.post('/auth', function(req, res) {
    auth.authenticate(req, res);
});

module.exports = router;