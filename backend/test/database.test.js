const request = require('supertest');
const app = require('../app');


const formData = {
            username: 'test',
            first_name: 'loled',
            last_name: 'lolz',
            password: 'LOLE',
            languages: ['en']        
        }
        
let auth;

describe('est', () => {
    test('Create User', done => {
        request(app)
            .post('/users')
            .send(formData)
            .expect(200)
            .then(res => {
                auth = res.body['token'];
                done();
            });
            
    });

    test('Create Channel', done => {
        request(app)
            .get('/chat/test')
            .then(res => {
                done();
            });
    }); 
    
    let channelId;
    
    test('Get Channel', done => {
        request(app)
            .get('/chat/channels')
            .set('Authorization', 'BEARER ' + auth)
            .then(res => {
                console.log(res.body);
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
            .then(res => {
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
            .then(res => {
                done();
            });
    });
    
    test('Get Message', done => {
        request(app)
            .post('/chat/channels/messages')
            .set('Authorization', 'BEARER ' + auth)
            .then(res => {
                console.log(res.body);
            });
        
    });
    
    test('Leave Channel', done => {
        request(app)
            .post('/chat/channels/leave')
            .set('Authorization', 'BEARER ' + auth)
            .send({channelId: channelId})
            .then(res => {
                console.log(res.body);
            });
    });
    
    test('Delete', done => {
        request(app)
            .post('/users/delete')
            .send(formData)
            .expect(200)
            .then(res => {
                done();
            });
        
    });
});