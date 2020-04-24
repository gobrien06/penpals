const request = require('supertest');
const app = require('../app');


const formData = {
            username: 'test',
            first_name: 'loled',
            last_name: 'lolz',
            password: 'LOLE',
            languages: ['en']        
        }
        
describe('Test User', () => {
    test('Create User', done => {
        
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
        request(app)
            .post('/users/delete')
            .send(formData)
            .then(res => {
                console.log(res.statusCode);
                done();
            });
        
    });
});