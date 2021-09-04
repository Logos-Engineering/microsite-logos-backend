const model = require('../models/index');

async function getAllLinksPublic(req, res, next) {
  try {
    // dapatkan semua link berdasarkan field publish bernilai true
    const dataLinks = await model.Microsite.findAll({
      attributes: ['name', 'link'],
      where: {
        publish: true,
      },
      include: [
        {
          model: model.Category,
          attributes: ['name'],
        },
        {
          model: model.Webinar,
          attributes: ['title', 'image', 'summary'],
        },
      ],
    });

    let reconstructData = [];

    if (dataLinks.length > 0) {
      // pengelompokan data link berdasarkan kategori
      reconstructData = dataLinks.reduce((map, value) => {
        map[value.Category.name] = [
          ...(map[value.Category.name] || []),
          {
            name: value.name,
            link: value.link,
            ...value.Webinar && { title: value.Webinar.title },
            ...value.Webinar && { image: value.Webinar.image },
            ...value.Webinar && { summary: value.Webinar.summary },
          },
        ];
        return map;
      }, {});
    }

    res.status(200).json({ data: reconstructData });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllLinksPublic };
