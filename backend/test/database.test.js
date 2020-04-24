const request = require('supertest');
const app = require('../app');

describe('Test User', () => {
    test('Create User', done => {
        const formData = {
            username: 'test',
            first_name: 'loled',
            last_name: 'lolz',
            password: 'LOLE',
            languages: ['en']        
        }
        request(app)
            .post('/users')
            .send(formData)
            .then(res => {
                console.log(res.statusCode);
                done();
            });
            
    });

});

describe('Delete User', () => {
    test('Delete', done => {
        const formData = {
            username: 'test',
            first_name: 'loled',
            last_name: 'lolz',
            password: 'LOLE',
            languages: ['en']        
        }
        request(app)
            .post('/users/delete')
            .send(formData)
            .then(res => {
                console.log(res.statusCode);
                done();
            });
        
    });
});