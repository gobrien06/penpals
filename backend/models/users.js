var pg_client = require('../database/database');
var bcrypt = require('bcrypt');
var chat = require('../models/chat');
var jwt = require('jsonwebtoken');
var auth = require('../models/auth');

const query_insert = 'INSERT INTO users (username, pass, first_name, last_name,  languages) VALUES ($1, $2, $3, $4, $5)';

function insert(req, res) {
    bcrypt.hash(req.body.password, 12).then((hash) => {
       pg_client.query(query_insert, [req.body.username, hash, req.body.first_name, req.body.last_name, req.body.languages]).then(result => {
           
            res.json({
                token: 'SUCCESS'
            });
        }, result => {
            res.json({
                success: false
            });
        });
    }, result => {
        console.log(result);
    });
}

const query_delete = 'DELETE FROM users WHERE username = $1';

function delete(req, res) {
    pg_client.query(query_authenticate, [req.body.username]).then(result => {
        bcrypt.compare(req.body.password, result[0]['password'], (err, result) => {
            if(result == true) {
                pg_client.query(query_delete, [req.body.username]).then(result => {
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

module.exports = {insert, delete};