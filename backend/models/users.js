var pg_client = require('../database/database');
var bcrypt = require('bcrypt');
var chat = require('../models/chat');
var jwt = require('jsonwebtoken');
var auth = require('../models/auth');

const q_insert = 'INSERT INTO users (username, pass, first_name, last_name,  languages) VALUES ($1, $2, $3, $4, $5)';

function insert(req, res) {
    bcrypt.hash(req.body.password, 12).then((hash) => {
        pg_client.query(q_insert, [req.body.username, hash, req.body.first_name, req.body.last_name, req.body.languages]).then(result => {
            res.status(200);
            auth.authenticate(req, res);
        }, result => {
            res.sendStatus(401);
        });
    }, result => {
        res.sendStatus(401);
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