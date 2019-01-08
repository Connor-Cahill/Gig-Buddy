const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('index', () => {
    
    it('Should render the home page at: / ', (done) => {
        agent
        .get('/')
        .end((err, res) => {
            res.should.be.html;
            res.status.should.be.equal(200);
            done();
        })
    })
})
