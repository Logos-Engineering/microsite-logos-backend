/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const fs = require('fs');

const server = require('../../server');
const model = require('../../src/models/index');

chai.use(chaiHttp);

const endpoint = '/api/dashboard/links';

describe('Test CRUD link data', () => {
  let idLinkData;
  let idLinkDataWebinar;

  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        console.log('DB connection has been established successfully.');
        done();
      }).catch((error) => {
        done(error);
      });
  });

  describe('Test CRUD links data with valid payload', () => {
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
      titleWebinar: 'Webinar 1',
      imageWebinar: fs.readFileSync(`${process.cwd()}/testing.jpg`),
      summaryWebinar: 'jwiwjijwiiw',
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
      titleWebinar: 'Webinar Update',
      imageWebinar: fs.readFileSync(`${process.cwd()}/testing.jpg`),
      summaryWebinar: 'jwiwjijwiiw',
    };

    let pathImgWebinar;

    describe('POST /api/dashboard/links', () => {
      it('should have response status 201 value and data property with correct value', (done) => {
        chai.request(server)
          .post(endpoint)
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

      it('should have response status 201 value and data property with correct value, but this is webinar category', (done) => {
        chai.request(server)
          .post(endpoint)
          .field('name', linkDataWebinar.name)
          .field('link', linkDataWebinar.link)
          .field('publish', linkDataWebinar.publish)
          .field('category', linkDataWebinar.category)
          .field('titleWebinar', linkDataWebinar.titleWebinar)
          .attach('imageWebinar', linkDataWebinar.imageWebinar, 'testing.jpg')
          .field('summaryWebinar', linkDataWebinar.summaryWebinar)
          .end((err, res) => {
            if (err) done(err);

            const { data } = res.body;
            idLinkDataWebinar = data.id;
            pathImgWebinar = data.image;

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('data');

            expect(data).to.be.an('object');
            expect(data).to.have.property('id').that.is.a('string');
            expect(data).to.have.deep.property('name', linkDataWebinar.name);
            expect(data).to.have.deep.property('link', linkDataWebinar.link);
            expect(data).to.have.deep.property('publish', linkDataWebinar.publish);
            expect(data).to.have.deep.property('category', linkDataWebinar.category);
            expect(data).to.have.deep.property('title', linkDataWebinar.titleWebinar);
            expect(data).to.have.property('image').that.is.a('string');
            expect(data).to.have.deep.property('summary', linkDataWebinar.summaryWebinar);
            done();
          });
      });
    });

    describe('GET /api/dashboard/links', () => {
      it('should have response status code 200 and have data property which type is an array', (done) => {
        chai.request(server)
          .get(endpoint)
          .end((err, res) => {
            if (err) done(err);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('array');
            expect(res.body.data).to.have.lengthOf.at.least(1);
            done();
          });
      });
    });

    describe('PUT /api/dashboard/links/:id', () => {
      it('should have response status code 200 and have data property with correct value', (done) => {
        chai.request(server)
          .put(`${endpoint}/${idLinkData}`)
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

      it('should have response status code 200 and have data property with correct value. Webinar', (done) => {
        chai.request(server)
          .put(`${endpoint}/${idLinkDataWebinar}`)
          .field('name', linkDataWebinarUpdate.name)
          .field('link', linkDataWebinarUpdate.link)
          .field('publish', linkDataWebinarUpdate.publish)
          .field('category', linkDataWebinarUpdate.category)
          .field('titleWebinar', linkDataWebinarUpdate.titleWebinar)
          .attach('imageWebinar', linkDataWebinarUpdate.imageWebinar, 'testingUpdate.jpg')
          .field('summaryWebinar', linkDataWebinarUpdate.summaryWebinar)
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
            expect(data).to.have.deep.property('title', linkDataWebinarUpdate.titleWebinar);
            expect(data).to.have.property('image').that.is.a('string');
            expect(data.image).to.not.equal(pathImgWebinar);
            expect(data).to.have.deep.property('summary', linkDataWebinarUpdate.summaryWebinar);
            done();
          });
      });
    });
  });

  describe('Test CRUD links data with invalid payload', () => {
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
        titleWebinar: 'webinar 1',
        imageWebinar: fs.readFileSync(`${process.cwd()}/testing.jpg`),
        summaryWebinar: 1222,
      },
      {
        name: 'link 2',
        link: 'https://url1.com',
        publish: true,
        category: 'webinar',
        titleWebinar: 'webinar 1',
        imageWebinar: fs.readFileSync(`${process.cwd()}/testing.svg`),
        summaryWebinar: 'ini testing',
      },
      {
        name: 'link 3',
        link: 'https://url1.com',
        publish: true,
        category: 'webinar',
        titleWebinar: '',
        imageWebinar: '',
        summaryWebinar: 'ini testing',
      },
      {
        name: 'link 4',
        link: 'https://url1.com',
        publish: true,
        category: 'webinar',
        titleWebinar: 'webinar 1',
        summaryWebinar: 'ini testing',
      },
    ];
    describe('POST /api/dashboard/links', () => {
      invalidLinkData.forEach((data) => {
        it('should respond with status 400 value and also have messages property', (done) => {
          chai.request(server)
            .post(endpoint)
            .send(data)
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.have.property('messages').that.is.an('array');
              done();
            });
        });
      });

      invalidLinkDataWebinar.forEach((data, index) => {
        it(`should respond with status value 400 and have error property. ${index}th index`, (done) => {
          chai.request(server)
            .post(endpoint)
            .field('name', data.name)
            .field('link', data.link)
            .field('publish', data.publish)
            .field('category', data.category)
            .field('titleWebinar', data.titleWebinar)
            .attach('imageWebinar', data.imageWebinar)
            .field('summaryWebinar', data.summaryWebinar)
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error').that.is.an('object');
              done();
            });
        });
      });

      it('should respond with status value 400 and have error property', (done) => {
        chai.request(server)
          .post(endpoint)
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

    describe('PUT /api/dashboard/links/:id', () => {
      invalidLinkData.forEach((data) => {
        it('should respond with status 400 value and also have messages property', (done) => {
          chai.request(server)
            .put(`${endpoint}/${idLinkData}`)
            .send(data)
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.have.property('messages').that.is.an('array');
              done();
            });
        });
      });

      invalidLinkDataWebinar.forEach((data, index) => {
        it(`should respond with status value 400 and have error property. ${index}th index`, (done) => {
          chai.request(server)
            .put(`${endpoint}/${idLinkDataWebinar}`)
            .field('name', data.name)
            .field('link', data.link)
            .field('publish', data.publish)
            .field('category', data.category)
            .field('titleWebinar', data.titleWebinar)
            .attach('imageWebinar', data.imageWebinar)
            .field('summaryWebinar', data.summaryWebinar)
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(400);
              expect(res.body).to.have.property('error').that.is.an('object');
              done();
            });
        });
      });

      it('should respond with status value 400 and have error property', (done) => {
        chai.request(server)
          .put(`${endpoint}/${idLinkDataWebinar}`)
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
  });
});
