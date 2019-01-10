// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../app.js');
// const should = chai.should();
// const expect = chai.expect;
// const User = require('../models/user');

// chai.use(chaiHttp);
// const agent = chai.request.agent(server);

// const sampleUser = {
//     firstName: 'userTest',
//     lastName: 'testDude',
//     email: 'testdude@test.com',
//     phoneNumber: '(417)123-4567',
//     venmoUsername: 'testDuder',
//     password: 'test',
// };

// describe('Users', () => {
//     before((done) => {
//         agent
//         .post('/sign-up')
//         .send(sampleUser)
//         .then(() => {
//             done();
//         })
//         .catch(err => done(err));
//     });

//     after( async (done) => {
//         await User.findOneAndRemove(sampleUser).exec();
//         return done();
//     });

//     it('Should return list of all users at GET: /api/users', (done) => {
//         agent
//         .get('/api/users')
//         .end((err, res) => {
//             if (err) { done(err) }
//             res.status.should.be.equal(200);
//             expect(res).to.have('clients');
//             res.should.be.json;
//             return done();
//         })
//     });

//     it('Should return info on Specific client at GET: /api/users/:id ', wrap(async (done) => {
//         const user = await User.findOne(mockUser).exec();

//         agent
//         .get(`/api/users/${user._id}`)
//         .end((err, res) => {
//             if (err) { done(err) }
//             res.status.should.be.equal(200);
//             res.should.be.json;
//             expect(res).to.have('firstName');
//             expect(res).to.have('lastName');
//             return done();
//         })
//     }));
// })