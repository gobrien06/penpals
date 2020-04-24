const request = require('supertest');
const app = require('../app');

test('Signup', done => {
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
            console.log(res.body);
            done();
        });
        
});

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
            console.log(res.body);
            done();
        });
    
});