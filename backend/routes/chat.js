var express = require('express');
var router = express.Router();
var auth = require('../models/auth');
var chat = require('../models/chat');



router.get('/chat/channels', auth.authenticateJWT, function(req, res) {
    chat.getChannels(req, res);
});

router.post('/chat/channels/join', auth.authenticateJWT, function(req, res) {
    chat.joinChannel(req, res);
});

router.post('/chat/channels/leave', auth.authenticateJWT, function(req, res) {
    chat.leaveChannel(req, res);
});

router.post('/chat/channels/messages', auth.authenticateJWT, function(req, res) {
    chat.getMessages(req, res);
});

router.post('/chat/channels/send', auth.authenticateJWT, function(req, res) {
    chat.sendMessage(req, res);
});

router.get('/chat/test', function(req, res) {
   chat.createChannel(['test', 'test2'], res);    
});


module.exports = router;