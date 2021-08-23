const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');

const server = require('../server');
const model = require('../src/models/index');

chai.use(chaiHttp);

const endpoint = '/api/auth';

const user = {
  username: 'user test',
  password: 'Slslwww8s7s8ss',
};

const invalidUserData = [
  {
    username: 12,
    password: 'Slslwww8s7s8ss',
  },
  {
    password: 'Slslwww8s7s8ss',
  },
  {
    username: 'user test',
    password: true,
  },
  {},
];

let refToken;

describe('Testing for authentication system', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        process.stdout.write(`Connection has been established successfully.\n`);
        return model.User.create(user);
      }).then(() => {
        done();
      }).catch((error) => {
        done(error);
      });
  });

  describe('Login', () => {
    it('respond with status 201 and accessToken, refreshToken properties', (done) => {
      chai.request(server)
        .post(endpoint)
        .send(user)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          const { data } = res.body;
          expect(data).to.have.property('accessToken');
          expect(data).to.have.property('refreshToken');
          refToken = data.refreshToken;
          done();
        });
    });

    invalidUserData.forEach((elem) => {
      it('respond with status 400', (done) => {
        chai.request(server)
          .post(endpoint)
          .send(elem)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('messages');
            done();
          });
      });
    });
  });

  describe('Refresh access token', () => {
    it('respond with status 200', (done) => {
      chai.request(server)
        .put(endpoint)
        .send({ refreshToken: refToken })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          const { data } = res.body;
          expect(data).to.have.property('accessToken');
          done();
        });
    });
  });

  describe('Logout', () => {
    it('respond with status 200', (done) => {
      chai.request(server)
        .delete(endpoint)
        .send({ refreshToken: refToken })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });

    it('respond with status 401', (done) => {
      chai.request(server)
        .put(endpoint)
        .send({ refreshToken: refToken })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error');
          const { error } = res.body;
          expect(error).to.have.property('message');
          done();
        });
    });
  });
});
