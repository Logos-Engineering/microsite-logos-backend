/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const app = require('../server');
const model = require('../src/models/index');

chai.use(chaiHttp);

describe('GET /api/links', () => {
  const data = [
    {
      name: 'Link 1',
      link: 'url 1',
      publish: true,
      Category: {
        name: 'donasi',
      },
    },
    {
      name: 'Link 2',
      link: 'url 2',
      publish: false,
      Category: {
        name: 'partnership',
      },
    },
    {
      name: 'Link 3',
      link: 'url 3',
      publish: true,
      Category: {
        name: 'sosial media',
      },
    },
  ];

  // inisialisasi koneksi DB
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        process.stdout.write(`Connection has been established successfully.\n`);
        return model.Microsite.bulkCreate(data, { include: [model.Category] });
      })
      .then(() => {
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  describe('GET /api/links', () => {
    it('should GET all links which column publish is true', (done) => {
      chai.request(app)
        .get('/api/links')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.have.all.keys('donasi', 'sosial media');
          done();
        });
    });
  });
});
