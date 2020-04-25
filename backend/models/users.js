var pg_client = require('../database/database');
var bcrypt = require('bcrypt');
var chat = require('../models/chat');
var jwt = require('jsonwebtoken');
var auth = require('../models/auth');
const matcher = require('../models/matcher');

const q_insert = 'INSERT INTO users (username, pass, first_name, last_name,  languages, coords) VALUES ($1, $2, $3, $4, $5, $6)';

function insert(req, res) {
    bcrypt.hash(req.body.password, 12).then((hash) => {
        pg_client.query(q_insert, [req.body.username, hash, req.body.first_name, req.body.last_name, req.body.languages, req.body.coords]).then(result => {
            res.status(200);
            chat.createChannel([req.body.username, 'Talkative Tyler'], false);
            //matcher.matchRandomWithLanguageConstraint(req.body.username, req.body.languages);
            auth.authenticate(req, res);
        }, result => {
            console.log(result);
            res.sendStatus(401);
        });
    }, result => {
        res.sendStatus(401);
    });
}

const q_updateCoords = 'UDPATE users SET coords = $1 WHERE username = $2';

function updateCoords(req, res) {
    pg_client.query(q_updateCoords, [req.body.coords, req.user]).then(result => {
        res.sendStatus(200);
    }, result => {
        console.log(result);
        res.sendStatus(400);
    });

}

const q_delete = 'DELETE FROM users WHERE username = $1';
const q_authenticate = 'SELECT * FROM users WHERE username = $1';

function delete_user(req, res) {
    pg_client.query(q_authenticate, [req.body.username]).then(result => {
        bcrypt.compare(req.body.password, result['rows'][0]['pass'], (err, result) => {
            if(result == true) {
                pg_client.query(q_delete, [req.body.username]).then(result => {
                    res.sendStatus(200);
                }, result => {
                    res.sendStatus(401);
                });
            } else {
                res.sendStatus(401);
            };
        });
    }, result => {
        res.sendStatus(401);
    });
}

module.exports = {insert, delete_user};