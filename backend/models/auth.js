var pg_client = require('../database/database');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var accessTokenSecret = 'test';//crypto.randomBytes(64).toString('hex');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, payload) => {
            if (err) {
                console.log(token);
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = payload.user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


const q_authenticate = 'SELECT * FROM users WHERE username = $1';

function authenticate(req, res) {
    pg_client.query(q_authenticate, [req.body.username]).then(result => {
        bcrypt.compare(req.body.password, result['rows'][0]['pass'], (err, result) => {
            if(result == true) {
                let accessToken = jwt.sign({user: req.body.username}, accessTokenSecret);
                res.status(200);
                res.json({
                    token: accessToken
                });
            } else {
                
                console.log('3');
                res.sendStatus(401);
            };
        });
    }, result => {
        
        console.log('4');
        console.log(result);
        res.sendStatus(401);
    });
}

module.exports = {authenticateJWT, authenticate};