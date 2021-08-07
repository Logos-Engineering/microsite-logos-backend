const model = require('../models/index');

const getAllLinksPublic = async (req, res, next) => {
  try {
    // dapatkan semua link berdasarkan field publish bernilai true
    const dataLinks = await model.Microsite.findAll({
      attributes: ['name', 'link'],
      where: {
        publish: true
      },
      include: [
        {
          model: model.Category,
          attributes: ['name'],
        },
        {
          model: model.Webinar,
          attributes: ['title', 'image', 'summary']
        }
      ]
    });

    let reconstructData = [];

    if(dataLinks.length > 0) {
      // pengelompokan data link berdasarkan kategori
      reconstructData = dataLinks.reduce((map, value) => {
        map[value.Category.name] = [
          ...(map[value.Category.name] || []),
          {
            name: value.name,
            link: value.link,
            webinar: value.Webinar
          },
        ];
        return map;
      }, {});
    }

    res.status(200).json({ data: reconstructData });

  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllLinksPublic };