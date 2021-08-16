/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const fs = require('fs');

const server = require('../../server');
const model = require('../../src/models/index');

chai.use(chaiHttp);

describe('Test CRUD link data', () => {
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

    describe('POST /api/dashboard/links', () => {
      it('should have response status 201 value and data property with correct value', (done) => {
        chai.request(server)
          .post('/api/dashboard/links')
          .send(linkdata)
          .end((err, res) => {
            if (err) done(err);

            const { data } = res.body;

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
          .post('/api/dashboard/links')
          .field('name', 'link webinar')
          .field('link', 'https://sksks.com/shushush')
          .field('publish', false)
          .field('category', 'webinar')
          .field('titleWebinar', 'Webinar 1')
          .attach('imageWebinar', fs.readFileSync(`${process.cwd()}/testing.jpg`), 'testing.jpg')
          .field('summaryWebinar', 'jwiwjijwiiw')
          .end((err, res) => {
            if (err) done(err);

            const { data } = res.body;

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('data');

            expect(data).to.be.an('object');
            expect(data).to.have.property('id').that.is.a('string');
            expect(data).to.have.deep.property('name', 'link webinar');
            expect(data).to.have.deep.property('link', 'https://sksks.com/shushush');
            expect(data).to.have.deep.property('publish', false);
            expect(data).to.have.deep.property('category', 'webinar');
            expect(data).to.have.deep.property('title', 'Webinar 1');
            expect(data).to.have.property('image').that.is.a('string');
            expect(data).to.have.deep.property('summary', 'jwiwjijwiiw');

            done();
          });
      });
    });
  });

  describe('Test CRUD links data with invalid payload', () => {
    describe('POST /api/dashboard/links', () => {
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

      invalidLinkData.forEach((data) => {
        it('should respond with status 400 value and also have messages property', (done) => {
          chai.request(server)
            .post('/api/dashboard/links')
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

      invalidLinkDataWebinar.forEach((data, index) => {
        it(`should respond with status value 400 and have error property. ${index}th index`, (done) => {
          chai.request(server)
            .post('/api/dashboard/links')
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
          .post('/api/dashboard/links')
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
