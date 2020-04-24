var pg_client = require('../database/database');

const q_createChannel = 'INSERT INTO channels (members, pending_members) VALUES ($1, $2) RETURNING channelid';
const q_addPendingUserChannels = 'UPDATE users SET pending_channels = array_append(pending_channels, $1) WHERE username = $2';

function createChannel(members, res) {
    pg_client.query(q_createChannel, [[], members]).then(result => {
        let promises = [];
        for(let i = 0; i < members.length; ++i) {
            let user = members[i];
            promises.push(pg_client.query(q_addPendingUserChannels, [result['rows'][0]['channelid'], user]).then(result => {
            
            }, result => {
                console.log(result);
            }));
        }
        Promise.all(promises).then(result => {
            res.sendStatus(200);
        });
    }, result => {
        console.log(result)
    });
}

const q_getChannels = 'SELECT channels, pending_channels FROM users WHERE username = $1';
const q_getChannelMembers = 'SELECT * FROM channels WHERE channelid = ANY($1::uuid[])';

function getChannels(req, res) {
    pg_client.query(q_getChannels, [req.user]).then(allChannels => {
        let promises = [];
        let pending_channels = [];
        let channels = [];
        if(allChannels['rows'][0]['pending_channels'].length != 0) {
            promises.push(pg_client.query(q_getChannelMembers, [allChannels['rows'][0]['pending_channels']]).then(result => {
                for(let i = 0; i < result['rows'].length; i++) {
                    let members = [...result['rows'][i]['members'], ...result['rows'][i]['pending_members']];
                    members = members.filter((e) => {return e != req.user});
                    if(members.length != 0) {
                        pending_channels.push({channelId: result['rows'][i]['channelid'], members: members});
                    }
                }
            }, result => {
               console.log(result); 
            }));
        }
        if(allChannels['rows'][0]['channels'].length != 0) {
            promises.push(pg_client.query(q_getChannelMembers, allChannels['rows'][0]['channels'].join("','")).then(result => {
                for(let i = 0; i < result.length; i++) {
                    let members = [...result[i]['members'], ...result[i]['pending_members']];
                    members = members.filter((e) => {return e != req.user});
                    if(members.length != 0) {
                        channels.push({channelId: result['rows'][i]['channelid'], members: members});
                    }
                }
            }, result => {
               console.log(result); 
            }));
            
        }
        Promise.all(promises).then(result => {
            res.status(200);
            res.json({channels: channels, pending_channels: pending_channels});
        });
                
    }, result => {
        console.log('asdf');
        console.log(result);
    });    
}

const q_addChannelMembers = 'UPDATE channels SET members = array_append(members, $1), pending_members = array_remove(pending_members, $1) WHERE channelid = $2';
const q_addUserChannels = 'UPDATE users SET channels = array_append(channels, $1), pending_channels = array_remove(pending_channels, $1) WHERE username = $2';

function joinChannel(req, res) {
    pg_client.query(q_addChannelMembers, [req.user, req.body.channelId]).then(result => {
        pg_client.query(q_addUserChannels, [req.body.channelId, req.user]).then(result => {
            res.sendStatus(201);
        }, result => {
            res.sendStatus(400);
            console.log(result);
        });
    }, result => {
        res.sendStatus(400);
        console.log(result)
    });
}

const q_removeChannel = 'DELETE FROM channels WHERE channelid = $1 RETURNING *'
const q_removeChannelMembers = 'UPDATE users SET channels = array_remove(channels, $1), pending_channels = array_remove(channels, $1) WHERE username = $2'

function leaveChannel(req, res) {
    //remove channel
    pg_client.query(q_removeChannel, [req.body.channelId]).then(result => {
        
        //remove channel from both users
        let members = [...result['rows'][0]['members'], ...result['rows'][0]['pending_members']];
        let promises = [];
        for(let i = 0; i < members.length; i++) {
            promises.push(pg_client.query(q_removeChannelMembers, [req.body.channelId, result['rows'][0]['members'][i]]).then(result => {
            
            }, result => {
                console.log(result);
                res.sendStatus(400);
            }));
        }
        Promise.all(promises).then(result => {
            res.sendStatus(200);
        });
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
    
}

const q_sendMessage = 'INSERT INTO messages (channelid, content) VALUES ($1, $2)';

function sendMessage(req, res) {
    pg_client.query(q_sendMessage, [req.body.channelId, req.body.content]).then(result => {
        res.sendStatus(201);
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

const q_getMessage = 'SELECT content FROM messages WHERE channelid = $1';

function getMessages(req, res) {
    pg_client.query(q_getMessage, [req.body.channelId]).then(result => {
        res.status(201);
        res.json(result['rows']);
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

module.exports = {createChannel, getChannels, sendMessage, getMessages, joinChannel, leaveChannel};