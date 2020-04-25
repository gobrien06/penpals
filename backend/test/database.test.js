const request = require('supertest');
const app = require('../app');
const pg_client = require('../database/database');
const matcher = require('../models/matcher');


const formData = {
            username: 'test',
            first_name: 'loled',
            last_name: 'lolz',
            password: 'LOLE',
            languages: ['en']        
        }

afterAll(() => {
    pg_client.end();
});

test.only('Matching', done => {
    matcher.matchRandomWithLanguageConstraint()
    
});
        
let auth;

describe('APP', () => {
    test('Create User', done => {
        request(app)
            .post('/users')
            .send(formData)
            .expect(200)
            .end((err, res) => {
                auth = res.body['token'];
                done();
            });
            
    });

    test('Create Channel', done => {
        request(app)
            .get('/chat/test')
            .expect(200)
            .end((err, res) => {
                done();
            });
    }); 
    
    let channelId;
    
    test('Get Channel', done => {
        request(app)
            .get('/chat/channels')
            .set('Authorization', 'BEARER ' + auth)
            .expect(200)
            .end((err, res) => {
                channelId = res.body['pending_channels'][0]['channelId'];
                done();
            });
    });
    
    test('Join Channel', done => {
        request(app)
            .post('/chat/channels/join')
            .set('Authorization', 'BEARER ' + auth)
            .send({channelId: channelId})
            .expect(201)
            .end((err, res) => {
                done();
            });
    });
    
    
    test('Send Message', done => {
        request(app)
            .post('/chat/channels/send')
            .set('Authorization', 'BEARER ' + auth)
            .send({
                channelId: channelId,
                content: {message: 'LOLEE'}
            })
            .expect(201)
            .end((err, res) => {
                done();
            });
    });
    
    test('Get Message', done => {
        request(app)
            .post('/chat/channels/messages')
            .set('Authorization', 'BEARER ' + auth)
            .send({
                channelId: channelId
            })
            .expect(201)
            .end((err, res) => {
                console.log(res.body);
                done();
            });
        
    });
    
    test('Leave Channel', done => {
        request(app)
            .post('/chat/channels/leave')
            .set('Authorization', 'BEARER ' + auth)
            .send({channelId: channelId})
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
    
    test('Delete', done => {
        request(app)
            .post('/users/delete')
            .send(formData)
            .expect(200)
            .end((err, res) => {
                done();
            });
        
    });
    
});