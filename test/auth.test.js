const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');

const server = require('../server');
const model = require('../src/models/index');

chai.use(chaiHttp);

const endpoint = '/api/auth';

const user = {
  username: 'adminTesting',
  password: 'Admin88888du',
  role: 'admin',
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

let accToken;
let refToken;

describe('Testing for authentication and authorization systems', () => {
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

  describe('Authentication system', () => {
    describe('Login', () => {
      it('respond with status 201 and accessToken, refreshToken properties', (done) => {
        chai.request(server)
          .post(endpoint)
          .send({
            username: user.username,
            password: user.password,
          })
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

  describe('Authorization system', () => {
    before('Login admin', (done) => {
      chai.request(server)
        .post(endpoint)
        .send({
          username: user.username,
          password: user.password,
        })
        .end((err, res) => {
          if (err) done(err);
          const { accessToken, refreshToken } = res.body.data;
          accToken = accessToken;
          refToken = refreshToken;
          done();
        });
    });

    beforeEach((done) => {
      chai.request(server)
        .put(endpoint)
        .send({ refreshToken: refToken })
        .end((err, res) => {
          if (err) done(err);
          accToken = res.body.data.accessToken;
          done();
        });
    });

    it('POST /api/dashboard/users. It should respond with status 403', (done) => {
      chai.request(server)
        .post('/api/dashboard/users')
        .set('Authorization', `Bearer ${accToken}`)
        .send({
          username: 'User1',
          password: 'secret123',
        })
        .end((err, res) => {
          if (err) done(err);

          const { error } = res.body;

          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');

          expect(error).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('GET /api/dashboard/users. It should respond with status 403', (done) => {
      chai.request(server)
        .get('/api/dashboard/users')
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          const { error } = res.body;

          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');

          expect(error).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('PUT /api/dashboard/users. It should respond with status 403', (done) => {
      chai.request(server)
        .put('/api/dashboard/users/okoko8889999999990j')
        .set('Authorization', `Bearer ${accToken}`)
        .send({
          username: 'User update',
          oldPassword: 'secret123',
          newPassword: 'secret123',
        })
        .end((err, res) => {
          if (err) done(err);

          const { error } = res.body;

          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');

          expect(error).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('DELETE /api/dashboard/users. It should respond with status 403', (done) => {
      chai.request(server)
        .delete('/api/dashboard/users/okoko8889999999990j')
        .set('Authorization', `Bearer ${accToken}`)
        .send({
          username: 'User update',
          oldPassword: 'secret123',
          newPassword: 'secret123',
        })
        .end((err, res) => {
          if (err) done(err);

          const { error } = res.body;

          expect(res).to.have.status(403);
          expect(res.body).to.have.property('error');

          expect(error).to.have.property('message').that.is.a('string');
          done();
        });
    });
  });
});
