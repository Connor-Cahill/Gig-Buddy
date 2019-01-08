const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const Client = require('../models/client');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const agent = chai.request.agent(server);
const sampleClient = {
    name: 'Test Client',
    description: 'This is a testing client',
    email: 'email@email.com',
    phoneNumber: '(913)209-4938',
};


describe('Clients', () => {

    it('Should return all clients at GET: /clients', (done) => {
        agent
        .get('/clients')
        .end((err, res) => {
            res.should.be.html;
            res.status.should.be.equal(200);
            return done();
        })
    });
    
    it('Should create a new client with correct credentials at POST: /clients', (done) => {
        Client.findOneAndRemove(sampleClient)
        .then(() => {
            Client.find({})
            .then(clients => {
                const clientCount = clients.length || 0;

                agent
                .post('/clients')
                .send(sampleClient)
                .then((res) => {
                    Client.find({})
                    .then(updatedClients => {
                        clientCount.should.be.equal(updatedClients.length - 1);
                        res.should.be.html;
                        res.status.should.be.equal(200);
                        return done();
                    })
                    .catch(err => done(err))
                })
                .catch(err => done(err))
            })
            .catch(err => done(err))
        })
        .catch(err => done(err))
    });


    it('Should remove Client from database at DELETE: /clients/:id', (done) => {
        const newClient = new Client(sampleClient);
        newClient.save()
        .then(() => {
            console.log('Before the 1st find*')
            Client.find({})
            .then(clients => {
                const clientCount = clients.length || 0;
                    
                agent
                .delete(`/clients/${newClient._id}`)
                .then((res) => {
                    console.log('Before the 2nd find**')
                    Client.find({})
                    .then((updatedClients) => {
                        clientCount.should.be.equal(updatedClients.length + 1);
                        return done();
                    })
                    .catch(err => done(err))
                })
                .catch(err => done(err))
            })
            .catch(err => done(err))
        })
        .catch(err => done(err));
    });

    it('Should render an html page and have status 200 at DELETE: /clients/:id', (done) => {
        const client = new Client(sampleClient);
        client.save()
        .then((client) => {
            agent
            .delete(`/clients/${client._id}`)
            .end((err, res) => {
                res.status.should.be.equal(200);
                res.should.be.html;
                return done();
            })
        })
        .catch(err => done(err))
        
    });
    
})