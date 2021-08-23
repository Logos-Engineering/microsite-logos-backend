/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const fs = require('fs');

const server = require('../../server');
const model = require('../../src/models/index');

chai.use(chaiHttp);

const endpoint = '/api/dashboard/links';

let accToken;
let refToken;
let idLinkData;
let idLinkDataWebinar;
let pathImgWebinar;

const user = {
  username: 'user test',
  password: 'Slslwww8s7s8ss',
};

const linkdata = {
  name: 'link 1',
  link: 'https://url1.com',
  publish: true,
  category: 'donasi',
};

const linkDataWebinar = {
  name: 'link webinar',
  link: 'https://sksks.com/shushush',
  publish: false,
  category: 'webinar',
  title: 'Webinar 1',
  image: fs.readFileSync(`${process.cwd()}/test/helper/testing.jpg`),
  summary: 'jwiwjijwiiw',
};

const linkDataUpdate = {
  name: 'link data update',
  link: 'https://url1.com',
  publish: false,
  category: 'partnership',
};

const linkDataWebinarUpdate = {
  name: 'link update',
  link: 'https://sksks.com/shushush',
  publish: true,
  category: 'webinar',
  title: 'Webinar Update',
  image: fs.readFileSync(`${process.cwd()}/test/helper/testing.jpg`),
  summary: 'jwiwjijwiiw',
};

const invalidLinkData = [
  {
    name: 121,
    link: 'https://url1.com',
    publish: true,
    category: 'donasi',
  },
  {
    link: 'https://url1.com',
    publish: true,
    category: 'donasi',
  },
  {
    name: 'link 1',
    link: 'url1.com',
    publish: true,
    category: 'donasi',
  },
  {
    name: 'link 1',
    link: 'https://url1.com',
    publish: 'truefalsed',
    category: 'donasi',
  },
  {
    name: 'link 1',
    link: 'https://url1.com',
    publish: true,
  },
  {
    name: 'link 1',
    link: 'https://url1.com',
    publish: true,
    category: true,
  },
];

const invalidLinkDataWebinar = [
  {
    name: 121,
    link: 'https://url1.com',
    publish: true,
    category: 'webinar',
    title: 'webinar 1',
    image: fs.readFileSync(`${process.cwd()}/test/helper/testing.jpg`),
    summary: 1222,
  },
  {
    name: 'link 2',
    link: 'https://url1.com',
    publish: true,
    category: 'webinar',
    title: 'webinar 1',
    image: fs.readFileSync(`${process.cwd()}/test/helper/testing.svg`),
    summary: 'ini testing',
  },
  {
    name: 'link 3',
    link: 'https://url1.com',
    publish: true,
    category: 'webinar',
    title: '',
    image: '',
    summary: 'ini testing',
  },
  {
    name: 'link 4',
    link: 'https://url1.com',
    publish: true,
    category: 'webinar',
    title: 'webinar 1',
    summary: 'ini testing',
  },
];

describe('Testing CRUD for link data', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        process.stdout.write(`Connection has been established successfully.\n`);
        return model.User.create(user);
      }).then(() => {
        chai.request(server)
          .post('/api/auth')
          .send(user)
          .end((err, res) => {
            if (err) done(err);
            const { accessToken, refreshToken } = res.body.data;
            accToken = accessToken;
            refToken = refreshToken;
            done();
          });
      }).catch((error) => {
        done(error);
      });
  });

  beforeEach((done) => {
    chai.request(server)
      .put('/api/auth')
      .send({ refreshToken: refToken })
      .end((err, res) => {
        if (err) done(err);
        accToken = res.body.data.accessToken;
        done();
      });
  });

  describe('POST /api/dashboard/links', () => {
    it('adds valid link data. It should return status 201 and data property with the correct value', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('Authorization', `Bearer ${accToken}`)
        .send(linkdata)
        .end((err, res) => {
          if (err) done(err);

          const { data } = res.body;
          idLinkData = data.id;

          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');

          expect(data).to.be.an('object');
          expect(data).to.have.property('id').that.is.a('string');
          expect(data).to.have.deep.property('name', linkdata.name);
          expect(data).to.have.deep.property('link', linkdata.link);
          expect(data).to.have.deep.property('publish', linkdata.publish);
          expect(data).to.have.deep.property('category', linkdata.category);
          done();
        });
    });

    it('adds valid webinar link data. It should return status 201 and data property with the correct value', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('Authorization', `Bearer ${accToken}`)
        .field('name', linkDataWebinar.name)
        .field('link', linkDataWebinar.link)
        .field('publish', linkDataWebinar.publish)
        .field('category', linkDataWebinar.category)
        .field('title', linkDataWebinar.title)
        .attach('image', linkDataWebinar.image, 'testing.jpg')
        .field('summary', linkDataWebinar.summary)
        .end((err, res) => {
          if (err) done(err);

          const { data } = res.body;
          idLinkDataWebinar = data.id;
          pathImgWebinar = data.image;
          console.log(pathImgWebinar);

          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');

          expect(data).to.be.an('object');
          expect(data).to.have.property('id').that.is.a('string');
          expect(data).to.have.deep.property('name', linkDataWebinar.name);
          expect(data).to.have.deep.property('link', linkDataWebinar.link);
          expect(data).to.have.deep.property('publish', linkDataWebinar.publish);
          expect(data).to.have.deep.property('category', linkDataWebinar.category);
          expect(data).to.have.deep.property('title', linkDataWebinar.title);
          expect(data).to.have.property('image').that.is.a('string');
          expect(data).to.have.deep.property('summary', linkDataWebinar.summary);
          done();
        });
    });

    invalidLinkData.forEach((data) => {
      it('adds invalid link data. It should return status 400 and messages property with the correct value', (done) => {
        chai.request(server)
          .post(endpoint)
          .set('Authorization', `Bearer ${accToken}`)
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

    invalidLinkDataWebinar.forEach((data) => {
      it('adds invalid webinar link data. It should return status 400 and messages/message property with the correct value', (done) => {
        chai.request(server)
          .post(endpoint)
          .set('Authorization', `Bearer ${accToken}`)
          .field('name', data.name)
          .field('link', data.link)
          .field('publish', data.publish)
          .field('category', data.category)
          .field('title', data.title)
          .attach('image', data.image)
          .field('summary', data.summary)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error').that.is.an('object');
            done();
          });
      });
    });

    it('adds invalid (with few missing fields) webinar link data. It should return status 400 and messages/message property with the correct value', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('Authorization', `Bearer ${accToken}`)
        .field('name', 'hsuhuhush')
        .field('link', 'https://swskow.com')
        .field('publish', true)
        .field('category', 'webinar')
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').that.is.an('object');
          done();
        });
    });
  });

  describe('GET /api/dashboard/links', () => {
    it('gets all links. It should respond with status 200 and also have data property which type is an array', (done) => {
      chai.request(server)
        .get(endpoint)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data').that.is.an('array');
          expect(res.body.data).to.have.lengthOf.at.least(1);
          done();
        });
    });
  });

  describe('GET /:file', () => {
    it('respond valid image', (done) => {
      chai.request(server)
        .get(`/${pathImgWebinar}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res).to.have.header('Content-Type', 'image/jpeg');
          done();
        });
    });
  });

  describe('PUT /api/dashboard/links/:id', () => {
    it('updates valid link data. It should respond with status 200 and have data property with correct value', (done) => {
      chai.request(server)
        .put(`${endpoint}/${idLinkData}`)
        .set('Authorization', `Bearer ${accToken}`)
        .send(linkDataUpdate)
        .end((err, res) => {
          if (err) done(err);

          const { data } = res.body;

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data').that.is.an('object');

          expect(data).to.have.property('id', idLinkData).that.is.a('string');
          expect(data).to.have.deep.property('name', linkDataUpdate.name);
          expect(data).to.have.deep.property('link', linkDataUpdate.link);
          expect(data).to.have.deep.property('publish', linkDataUpdate.publish);
          expect(data).to.have.deep.property('category', linkDataUpdate.category);
          done();
        });
    });

    it('updates valid webinar link data. It should respond with status 200 and have data property with correct value', (done) => {
      chai.request(server)
        .put(`${endpoint}/${idLinkDataWebinar}`)
        .set('Authorization', `Bearer ${accToken}`)
        .field('name', linkDataWebinarUpdate.name)
        .field('link', linkDataWebinarUpdate.link)
        .field('publish', linkDataWebinarUpdate.publish)
        .field('category', linkDataWebinarUpdate.category)
        .field('title', linkDataWebinarUpdate.title)
        .attach('image', linkDataWebinarUpdate.image, 'testingUpdate.jpg')
        .field('summary', linkDataWebinarUpdate.summary)
        .end((err, res) => {
          if (err) done(err);

          const { data } = res.body;

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data').that.is.an('object');

          expect(data).to.have.property('id', idLinkDataWebinar).that.is.a('string');
          expect(data).to.have.deep.property('name', linkDataWebinarUpdate.name);
          expect(data).to.have.deep.property('link', linkDataWebinarUpdate.link);
          expect(data).to.have.deep.property('publish', linkDataWebinarUpdate.publish);
          expect(data).to.have.deep.property('category', linkDataWebinarUpdate.category);
          expect(data).to.have.deep.property('title', linkDataWebinarUpdate.title);
          expect(data).to.have.property('image').that.is.a('string');
          expect(data.image).to.not.equal(pathImgWebinar);
          expect(data).to.have.deep.property('summary', linkDataWebinarUpdate.summary);
          done();
        });
    });

    invalidLinkData.forEach((data) => {
      it('updates invalid link data. It should respond with status 400 value and also have messages property', (done) => {
        chai.request(server)
          .put(`${endpoint}/${idLinkData}`)
          .set('Authorization', `Bearer ${accToken}`)
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

    invalidLinkDataWebinar.forEach((data) => {
      it('updates invalid webinar link data. It should respond with status value 400 and have error property', (done) => {
        chai.request(server)
          .put(`${endpoint}/${idLinkDataWebinar}`)
          .set('Authorization', `Bearer ${accToken}`)
          .field('name', data.name)
          .field('link', data.link)
          .field('publish', data.publish)
          .field('category', data.category)
          .field('title', data.title)
          .attach('image', data.image)
          .field('summary', data.summary)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error').that.is.an('object');
            done();
          });
      });
    });

    it('updates invalid (with few missing fields) webinar link data. It should respond with status value 400 and have error property', (done) => {
      chai.request(server)
        .put(`${endpoint}/${idLinkDataWebinar}`)
        .set('Authorization', `Bearer ${accToken}`)
        .field('name', 'hsuhuhush')
        .field('link', 'https://swskow.com')
        .field('publish', true)
        .field('category', 'webinar')
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').that.is.an('object');
          done();
        });
    });
  });

  describe('DELETE /api/dashboard/links/:id', () => {
    it('deletes link data. It should respond with status 200 and message property', (done) => {
      chai.request(server)
        .delete(`${endpoint}/${idLinkData}`)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Successfully deleted link data');
          done();
        });
    });

    it('deletes webinar link data. It should respond with status 200 and message property', (done) => {
      chai.request(server)
        .delete(`${endpoint}/${idLinkDataWebinar}`)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Successfully deleted link data');
          done();
        });
    });

    it('ensures that the data have been deleted', (done) => {
      chai.request(server)
        .get(endpoint)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data').that.is.an('array');
          expect(res.body.data.length).to.equal(0);
          done();
        });
    });

    it('deletes link data using an invalid id. It should respond with status 404', (done) => {
      chai.request(server)
        .delete(`${endpoint}/${idLinkData}`)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body.error).to.have.property('message', 'Link data is not found');
          done();
        });
    });

    it('deletes webinar link data using an invalid id. It should respond with status 404', (done) => {
      chai.request(server)
        .delete(`${endpoint}/${idLinkDataWebinar}`)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body.error).to.have.property('message', 'Link data is not found');
          done();
        });
    });

    it('deletes link data using an invalid id (boolean). It should respond with status 404', (done) => {
      chai.request(server)
        .delete(`${endpoint}/true`)
        .set('Authorization', `Bearer ${accToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body.error).to.have.property('message', 'Link data is not found');
          done();
        });
    });
  });
});
