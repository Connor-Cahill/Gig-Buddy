const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const Service = require('../models/service');
const should = chai.should();
const expect = chai.expect;
const User = require('../models/user');

chai.use(chaiHttp);

const agent = chai.request.agent(server);
const sampleService = {
    name: 'Test Service',
    pricing: 100,
    reoccurring: true,
};

const sampleUser = {
    firstName: 'Test',
    lastName: 'Dude',
    email: 'testdude@test.com',
    phoneNumber: '(417)123-4567',
    venmoUsername: 'testDuder',
    password: 'test',
}


describe('Services', () => {

    before((done) => {
        agent 
        .post('/sign-up')
        .send(sampleUser)
        .then(() => {
            return done();
        })
        .catch(err => done(err))
    })

    after((done) => {
        User.findOneAndRemove(sampleUser)
        .then(() => {
            return done()
        })
        .catch(err => done(err))
    })

    it('Should return all of a users services at GET: /services', (done) => {
        agent
        .get('/services')
        .end((err, res) => {
            res.should.be.html;
            res.status.should.be.equal(200);
            return done();
        })
    });

    it('Should create a new Service & add to database at POST: /services', (done) => {
        Service.findOneAndRemove(sampleService)
        .then(() => {
            Service.find({})
            .then((services) => {
                const serviceCount = services.length || 0;
                
                agent
                .post('/services')
                .send(sampleService)
                .then((res) => {
                    Service.find({})
                    .then((updatedServices => {
                        serviceCount.should.be.equal(updatedServices.length - 1);
                        res.should.be.html;
                        res.status.should.be.equal(200);
                        return done();
                    }))
                    .catch(err => done(err))
                })
                .catch(err => done(err))
            })
            .catch(err => done(err))
        })
        .catch(err => done(err))
    });

    it('Should delete Service & remove from DB at DELETE: /services/:id', (done) => {
        const newService = new Service(sampleService);
        newService.save()
        .then(() => {
            Service.find({})
            .then(services => {
                const serviceCount = services.length || 0;
    
                agent
                .delete(`/services/${newService._id}`)
                .then((res) => {
                   Service.find({})
                   .then((updatedServices) => {
                       serviceCount.should.be.equal(updatedServices.length + 1);
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

    it('Should render html and have status 200 at DELETE: /services/:id', (done) => {
        const service = new Service(sampleService);
        service.save()
        .then((service) => {
            agent
            .delete(`/services/${service._id}`)
            .end((err, res) => {
                res.status.should.be.equal(200);
                res.should.be.html;
                return done();
            })
        })
        .catch(err => done(err))
    });
})