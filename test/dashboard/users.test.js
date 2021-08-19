const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');

const server = require('../../server');
const model = require('../../src/models/index');

chai.use(chaiHttp);

const endpoint = '/api/dashboard/users';

describe('Test CRUD data user', () => {
  const validUserPayload = {
    username: 'User 1',
    password: 'Kjsjsiwwuwiuw',
  };

  const invalidPayloadUser = [
    {
      username: 1,
      password: 'KSKSKSKSKSKSK',
    },
    {
      username: 'Valid username',
      password: '1',
    },
    {
      username: 'Valid username',
      password: 128282882,
    },
  ];

  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        process.stdout.write(`Connection has been established successfully.\n`);
        done();
      }).catch((error) => {
        done(error);
      });
  });

  describe('POST /api/dashboard/users', () => {
    it('adds valid data user. It should respond with status 201 and data property with correct value', (done) => {
      chai.request(server)
        .post(endpoint)
        .send(validUserPayload)
        .end((err, res) => {
          if (err) done(err);

          const { data } = res.body;

          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');

          expect(data).to.have.property('id').that.is.a('string');
          expect(data).to.have.property('username', validUserPayload.username);
          done();
        });
    });

    invalidPayloadUser.forEach((data) => {
      it('adds invalid data user. It should respond with status 400 and error property', (done) => {
        chai.request(server)
          .post(endpoint)
          .send(data)
          .end((err, res) => {
            if (err) done(err);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('messages').that.is.an('object');
            done();
          });
      });
    });

    it('it adds an already username. It should respond with status 400 and error property', (done) => {
      chai.request(server)
        .post(endpoint)
        .send(validUserPayload)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.have.property('message').that.is.an('string');
          done();
        });
    });
  });

  describe('GET /api/dashboard/users', () => {
    it('should get all users and respond with status 200', (done) => {
      chai.request(server)
        .get(endpoint)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data').that.is.an('array');
          done();
        });
    });
  });
});
