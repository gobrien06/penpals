const express = require('express');
const router = express.Router();
const users = require('../models/users');
const auth = require('../models/auth');


router.post('/users', function(req, res) {
    users.insert(req, res);
});

router.post('/users/delete', auth.authenticateJWT, function(req, res) {
    users.delete_user(req, res);
});

router.post('/users/languages', auth.authenticateJWT, function(req, res) {
    users.updateLanguages(req, res);
});

router.post('/users/coords', auth.authenticateJWT, function(req, res) {
    users.updateCoords(req, res);    
});

router.get('/users/coords', auth.authenticateJWT, function(req, res) {
    users.getCoords(req, res);
});

router.get('/users/languages', auth.authenticateJWT, function(req, res) {
    users.getLanguages(req, res);
});

router.post('/auth', function(req, res) {
    auth.authenticate(req, res);
});

module.exports = router;