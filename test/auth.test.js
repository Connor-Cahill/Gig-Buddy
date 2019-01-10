const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();
const expect = chai.expect;
const User = require('../models/user');

chai.use(chaiHttp);
const agent = chai.request.agent(server);

const sampleUser = {
    firstName: 'Test',
    lastName: 'Dude',
    email: 'testdude@test.com',
    phoneNumber: '(417)123-4567',
    venmoUsername: 'testDuder',
    password: 'test',
};

const mockUser = {
    firstName: 'Tester',
    lastName: 'Duderrr',
    email: 'testduder@test.com',
    phoneNumber: '(417)123-4567',
    venmoUsername: 'testerDuder',
    password: 'tester',
}

describe('User Authenitacation', () => {

    before((done) => {
        agent
        .post('/sign-up')
        .send(mockUser)
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        })
    });

    //  Testing sign-up route
    it('Should create a new User & add to DB ALSO return a cookie at POST: /sign-up', (done) => {
        User.findOneAndRemove(sampleUser)
        .then(() => {
            User.find({})
            .then((users) => {
                const userCount = users.length || 0;

                agent
                .post('/sign-up')
                .send(sampleUser)
                .then((res) => {
                    User.find({})
                    .then((updatedUsers) => {
                        userCount.should.be.equal(updatedUsers.length - 1);
                        res.should.be.html;
                        res.status.should.be.equal(200);
                        expect(res).to.have.cookie('Token');
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

    it('Should log user in and return a cookie at POST: /sign-in', (done) => {
        agent
        .post('/sign-in')
        .send(mockUser)
        .end((err, res) => {
            if(err) { done(err) }
            res.status.should.be.equal(200);
            expect(res).to.have.cookie('Token');
            res.should.be.html;
            return done();
        })
    });

})
