

const {Pool, Client} = require('pg');

const client = new Client({
                        user:
                        host:
                        database:
                        password:
                        port:
                        });

client.connect();

module.exports = client;



