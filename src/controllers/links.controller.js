const model = require('../models/index');

async function postLinkController(req, res, next) {
  // mengambil payload yang telah lolos dari validator
  const {
    name,
    link,
    publish,
    category,
    titleWebinar,
    summaryWebinar,
  } = req.body;

  try {
    // mengembalikan id kategori
    const categoryId = await model.Category.findOrCreate({
      where: {
        name: category,
      },
    });

    // payload untuk tabel microsite
    const payload = {
      name,
      link,
      publish,
      CategoryId: categoryId[0].id,
    };

    // periksa jika kategori = webinar
    // maka simpan gambar yang diupload
    if (category === 'webinar') {
      // jika gambar tidak diupload maka respon dengan error
      if (!req.file) {
        const error = new Error('Image has to upload');
        error.statusCode = 400;
        throw error;
      }

      // simpan payload data webinar ke tabel webinar
      const webinar = await model.Webinar.create({
        title: titleWebinar,
        image: req.file.path,
        summary: summaryWebinar,
      });

      payload.WebinarId = webinar.id;

      // memasukkan payload data link ke tabel microsite
      const resultCreate = await model.Microsite.create(payload);
      res.status(201);
      return res.json({
        data: {
          id: resultCreate.id,
          name: resultCreate.name,
          link: resultCreate.link,
          publish: resultCreate.publish,
          category,
          title: webinar.title,
          image: webinar.image,
          summary: webinar.summary,
        },
      });
    }

    // memasukkan payload data link ke tabel microsite
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

async function getAllLinksController(req, res, next) {
  try {
    const result = await model.Microsite.findAll({
      attributes: ['id', 'name', 'link', 'publish'],
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

    // menyusun property
    const orderingProp = result.map((value) => ({
      id: value.id,
      name: value.name,
      link: value.link,
      publish: value.publish,
      category: value.Category.name,
      // jika webinar ada maka tambahkan property title, image, summary
      ...value.Webinar && { title: value.Webinar.title },
      ...value.Webinar && { image: value.Webinar.image },
      ...value.Webinar && { summary: value.Webinar.summary },
    }));
    res.status(200);
    res.json({ data: orderingProp });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postLinkController,
  getAllLinksController,
};
