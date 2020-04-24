var pg_client = require('../database/database');
var bcrypt = require('bcrypt');
var chat = require('../models/chat');

const query_insert = 'INSERT INTO users (username, first_name, last_name, password, languages) VALUES ($1, $2, $3, $4, $5)';

function insert(req, res) {
    
    bcrypt.hash(req.body.password, 12).then((hash) => {
       pg_client.query(query_insert, [req.body.username, req.body.first_name, req.body.last_name, hash, req.body.languages]).then(result => {
            //login normally with auth
            let accessToken = jwt.sign({user: req.body.username}, accessTokenSecret);
            res.json({
                token: accessToken
            });
        }, result => {
            res.json({
                success: false
            });
        });
    });
}
