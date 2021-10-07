const getAllLink = require('../services/public.service');

async function getAllLinksPublic(req, res, next) {
  try {
    // dapatkan semua link berdasarkan field publish bernilai true
    const dataLinks = await getAllLink();

    let arrData = [];

    if (dataLinks.length > 0) {
      // pengelompokan data link berdasarkan kategori
      arrData = dataLinks.reduce((map, value) => {
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

    res.status(200).json({ data: arrData });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllLinksPublic };
