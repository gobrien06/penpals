require('dotenv').config({path: '../.env'});

const {Pool, Client} = require('pg');

let config = {};

if(process.env.NODE_ENV == 'dev') {
    config = {
        user: process.env.TEST_PG_USER,
        host: 'localhost',
        database: process.env.TEST_PG_DB,
        password: process.env.TEST_PG_PASS,
        port: process.env.TEST_PG_PORT
    };
} else {
     config = {
        user: process.env.PG_USER,
        host: 'localhost',
        database: process.env.PG_DB,
        password: process.env.PG_PASS,
        port: process.env.PG_PORT
    };
    
}


const client = new Client(config);
client.connect();

module.exports = client;



