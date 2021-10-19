const { Microsite, Category, Webinar } = require('../models/index');

function getAllLink() {
  return Microsite.findAll({
    attributes: ['name', 'link'],
    where: {
      publish: true,
    },
    include: [
      {
        model: Category,
        attributes: ['name'],
      },
      {
        model: Webinar,
        attributes: ['title', 'image', 'summary'],
      },
    ],
  });
}

module.exports = getAllLink;
