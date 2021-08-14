const model = require('../models/index');

async function postLinkController(req, res, next) {
  // mengambil payload yang telah lolos dari validator
  const {
    name,
    link,
    publish,
    category,
    titleWebinar,
    summaryWebinar
  } = req.body;

  try {
    // mengembalikan id kategori
    const categoryId = await model.Category.findOrCreate({
      where: {
        name: category,
      },
    });

    console.log(categoryId);

    let payload = {
      name,
      link,
      publish,
      CategoryId: categoryId[0].id,
    };

    // periksa jika kategori = webinar
    // if (category === 'webinar') {

    // }

    // memasukkan data link ke tabel microsite
    const resultCreate = await model.Microsite.create(payload);

    res.status(201);
    res.json({
      data: {
        id: resultCreate.id,
        name: resultCreate.name,
        link: resultCreate.link,
        publish: resultCreate.publish,
        category,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { postLinkController };
