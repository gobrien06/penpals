var pg_client = require('../database/database');

const query_createChannel = 'INSERT INTO channels (members) VALUES ($1) RETURNING channelid';

function createChannel(members) {
    pg_client.query(query_createChannel, [[]]).then(result => {
        console.log(result);
        console.log(members[0]);
        for(let i = 0; i < members.length; ++i) {
            let user = members[i];
            knex('users').update({
                pending_channels: knex.raw("pending_channels || '{\"" + result.join("','") + "\"}'")
            }).where({username: user}).then(result => {
                console.log(result);
            }, result => {
                console.log(result);
            });
        }
    }, result => {
        console.log(result)
    });
}

const query_getChannels = 'SELECT channels, pending_channels FROM users WHERE username = $1';
const query_channelMembers = 'SELECT * FROM channels WHERE channelid in (\' $1 \')';

function getChannels(req, res) {
    pg_client(query_getChannels, req.user).then(allChannels => {
        let promises = [];
        let pending_channels = [];
        let channels = [];
        if(allChannels[0]['pending_channels'].length != 0) {
            promises.push(pg_client.query(query_channelMembers, [allChannels[0]['pending_channels'].join("','")]).then(result => {
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
            promises.push(pg_client.query(query_channelMembers, allChannels[0]['channels'].join("','")).then(result => {
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

const query_join_updateChannel = 'UPDATE channels SET members = array_append(members, $1), pending_members = array_remove(pending_members, $1) WHERE channelid = $2';
const query_join_updateUser = 'UPDATE users SET channels = array_append(channels, $1), pending_channels = array_remove(pending_channels, $1) WHERE username = $2';

function joinChannel(req, res) {
    pg_client.query(query_join_updateChannel, [req.user, req.body.channelId]).then(result => {
        pg_client.query(query_join_updateUser, [req.body.channelId, req.user]).then(result => {
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

const query_leave_updateChannel = 'DELETE FROM channels WHERE channelid = $1 RETURNING *'


function leaveChannel(req, res) {
    
    pg_client.query(query_leave_updateChannel, req.body.channelId).then(result => {
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

const query_sendMessage = 'INSERT INTO messages (channelid, content) VALUES ($1, $2)';

function sendMessage(req, res) {
    pg_client.query(query_sendMessage, [req.body.channelId, req.body.content]).then(result => {
        res.sendStatus(201);
        console.log(result); 
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

const query_getMessage = 'SELECT content WHERE channelid = $1';

function getMessages(req, res) {
    pg_client.query(query_getMessage, [req.body.channelId]).then(result => {
        res.status(201);
        res.json(result);
        console.log(result);
    }, result => {
        res.sendStatus(400);
        console.log(result);
    });
}

module.exports = {createChannel, getChannels, sendMessage, getMessages, joinChannel, leaveChannel};