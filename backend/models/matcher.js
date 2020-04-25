const pg_client = require('../database/database');
const chat = require('./chat.js');

const q_getRandomWithLanguageConstraint = 'SELECT TOP 1 * FROM users WHERE (language && $1::text[]) AND username != $2 ORDER BY NEWID()';

function matchRandomWithLanguageConstraint(user, user_languages) {
    pg_client.query(q_getRandomWithLanguageConstraint, [user_languages, user]).then(result => {
        console.log('matched');
    }, result => {
        console.log(result);
    });
}

function matchingService() {
    
}


//run once per 45 mins
matchServiceObj = setInterval(matchingService, 1000 * 60 * 45);

module.exports = {matchRandomWithLanguageConstraint};