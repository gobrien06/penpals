const pg_client = require('../database/database');
var chat = require('../models/chat');

//
const q_getRandomWithLanguageConstraint = 'SELECT * FROM users WHERE (languages && $1::text[]) AND NOT (username = ANY($2::text[])) ORDER BY random() LIMIT 1';
const q_addConnect = 'UPDATE users SET connect_members = array_append(connect_members, $1) WHERE username = $2';

function matchRandomWithLanguageConstraint(user, user_languages) {
    console.log(user);
    pg_client.query(q_getRandomWithLanguageConstraint, [user_languages, user]).then(result => {
        console.log(result['rows']);
        if(result['rows'].length != 0) {
            console.log(result['rows'][0]);
            chat.createChannel([user[user.length -1], result['rows'][0]['username']], false);
            pg_client.query(q_addConnect, [result['rows'][0]['username'], user[user.length -1]]).then(result => {
                console.log(result);
            }, result => {
                console.log(result);
            });
        }
    }, result => {
        console.log(result);
    });
}

const q_getCount = 'SELECT COUNT(*) FROM users';
const q_getRandom = 'SELECT * FROM users ORDER BY random() LIMIT $1';

function matchingService() {
    pg_client.query(q_getCount).then(result => {
        let count = (result['rows'][0]['count'] / 4) >> 0; 
        pg_client.query(q_getRandom, [count]).then(result => {
            for(let i = 0; i < result['rows'].length; i++){ 
                let users = [...result['rows'][i]['connect_members'], result['rows'][i]['username']];
                matchRandomWithLanguageConstraint(users, result['rows'][i]['languages']);
            }
        }, result => {
            console.log(result);
        });
    }, result => {
        console.log(result);
    });
}


//run once per 45 mins
//matchServiceObj = setInterval(matchingService, 1000 * 10);

module.exports = {matchRandomWithLanguageConstraint, matchingService};