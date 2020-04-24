var pg_client = require('../database/database');

const q_createChannel = 'INSERT INTO channels (members) VALUES ($1) RETURNING channelid';
const q_addPendingUserChannels = 'UPDATE users SET pending_channels = array_append(pending_channels, $1) WHERE username = $2';

function createChannel(members) {
    pg_client.query(query_createChannel, [[]]).then(result => {
        for(let i = 0; i < members.length; ++i) {
            let user = members[i];
            pg_client(q_addPendingUserChannels, [result['rows'][0]['channeldid']].then(result => {
                console.log(result);
            }, result => {
                console.log(result);
            });
        }
    }, result => {
        console.log(result)
    });
}

const q_getChannels = 'SELECT channels, pending_channels FROM users WHERE username = $1';
const q_getChannelMembers = 'SELECT * FROM channels WHERE channelid in (\' $1 \')';

function getChannels(req, res) {
    pg_client(q_getChannels, req.user).then(allChannels => {
        let promises = [];
        let pending_channels = [];
        let channels = [];
        if(allChannels[0]['pending_channels'].length != 0) {
            promises.push(pg_client.query(q_getChannelMembers, [allChannels[0]['pending_channels'].join("','")]).then(result => {
                for(let i = 0; i < result.length; i++) {
                    let members = [...result[i]['members'], ...result[i]['pending_members']];
                    members = members.filter((e) => {return e != req.user});
                    if(members.length != 0) {
                        pending_channels.push({channelId: result[i]['channelid'], members: members});
                    }
                }
            }, result => {
               console.log(result); 
            }));
        }
        if(allChannels[0]['channels'].length != 0) {
            promises.push(pg_client.query(q_getChannelMembers, allChannels[0]['channels'].join("','")).then(result => {
                for(let i = 0; i < result.length; i++) {
                    let members = [...result[i]['members'], ...result[i]['pending_members']];
                    members = members.filter((e) => {return e != req.user});
                    if(members.length != 0) {
                        channels.push({channelId: result[i]['channelid'], members: members});
                    }
                }
            }, result => {
               console.log(result); 
            }));
            
        }
        Promise.all(promises).then(result => {
            console.log({channels: channels, pending_channels: pending_channels});
            res.json({channels: channels, pending_channels: pending_channels});
        });
                
    }, result => {
        console.log(result);
    });    
}

const q_addChannelMembers = 'UPDATE channels SET members = array_append(members, $1), pending_members = array_remove(pending_members, $1) WHERE channelid = $2';
const q_addUserChannels = 'UPDATE users SET channels = array_append(channels, $1), pending_channels = array_remove(pending_channels, $1) WHERE username = $2';

function joinChannel(req, res) {
    pg_client.query(q_addChannelMembers, [req.user, req.body.channelId]).then(result => {
        pg_client.query(q_addUserChannels, [req.body.channelId, req.user]).then(result => {
            res.sendStatus(201);
            console.log(result);
        }, result => {
            res.sendStatus(400);
            console.log(result);
        });
    }, result => {
        res.sendStatus(400);
        console.log(result)
    });
}

const q_removeChannelMembers = 'DELETE FROM channels WHERE channelid = $1 RETURNING *'


function leaveChannel(req, res) {
    
    pg_client.query(q_removeChannelMembers, req.body.channelId).then(result => {
        //remove channel from both users
        
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
    /*
     knex('channels').update({
         //delete row
        members: knex.raw("array_remove(members, ?)", req.user)
    }).where({channelid: req.body.channelId}).then(result => {
        knex('users').update({
            channels: knex.raw("array_remove(channels, ?)", req.body.channelId),
            pending_channels: knex.raw("array_remove(pending_channels, ?)", req.body.channelId),
        }).where({username: req.user}).then(result => {
            res.sendStatus(201);
            console.log(result);
        }, result => {
            res.sendStatus(400);
            console.log(result);
        });
    }, result => {
        res.sendStatus(400);
        console.log(result)
    });
    */
    
}

const q_sendMessage = 'INSERT INTO messages (channelid, content) VALUES ($1, $2)';

function sendMessage(req, res) {
    pg_client.query(q_sendMessage, [req.body.channelId, req.body.content]).then(result => {
        res.sendStatus(201);
        console.log(result); 
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

const q_getMessage = 'SELECT content WHERE channelid = $1';

function getMessages(req, res) {
    pg_client.query(q_getMessage, [req.body.channelId]).then(result => {
        res.status(201);
        res.json(result);
        console.log(result);
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

module.exports = {createChannel, getChannels, sendMessage, getMessages, joinChannel, leaveChannel};