/* eslint-disable no-undef */
const fs = require('fs');

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

async function putLinkByIdController(req, res, next) {
  const {
    name,
    link,
    publish,
    category,
    titleWebinar,
    summaryWebinar,
  } = req.body;

  const linkId = req.params.id;

  try {
    // cek data link berdasarkan parameter id
    const dataMicrosite = await model.Microsite.findOne({
      where: {
        id: linkId,
      },
    });

    if (!dataMicrosite) {
      const error = new Error('Data is not found');
      error.statusCode = 404;
      throw error;
    }

    // dapatkan atau buat categori
    const categoryId = await model.Category.findOrCreate({
      where: {
        name: category,
      },
    });

    dataMicrosite.name = name;
    dataMicrosite.link = link;
    dataMicrosite.publish = publish;
    dataMicrosite.CategoryId = categoryId[0].id;

    let updateWebinar;

    if (category === 'webinar') {
      // jika gambar tidak diupload maka respon dengan error
      if (!req.file) {
        const error = new Error('Image has to upload');
        error.statusCode = 400;
        throw error;
      }

      const webinarId = dataMicrosite.WebinarId;

      // cek data webinar
      const dataWebinar = await model.Webinar.findOne({
        where: {
          id: webinarId,
        },
      });
      // menghapus gambar lama
      fs.unlink(`${process.cwd()}/${dataWebinar.image}`, (err) => {
        if (err) {
          throw new Error('Internal server error');
        }
      });

      dataWebinar.title = titleWebinar;
      dataWebinar.image = req.file.path;
      dataWebinar.summary = summaryWebinar;

      // perbarui data webinar
      updateWebinar = await dataWebinar.save();
    }

    // perbarui data link
    const updateMicrosite = await dataMicrosite.save();

    res.status(200);
    res.json({
      data: {
        id: updateMicrosite.id,
        name: updateMicrosite.name,
        link: updateMicrosite.link,
        publish: updateMicrosite.publish,
        category: categoryId[0].name,
        ...category === 'webinar' && { title: updateWebinar.title },
        ...category === 'webinar' && { image: updateWebinar.image },
        ...category === 'webinar' && { summary: updateWebinar.summary },
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteLinkByIdController(req, res, next) {
  const linkId = req.params.id;

  try {
    // ambil data link berdasarkan id
    const dataMicrosite = await model.Microsite.findOne({
      where: {
        id: linkId,
      },
    });

    // jika data link tidak ditemukan
    if (!dataMicrosite) {
      const error = new Error('Link data is not found');
      error.statusCode = 404;
      throw error;
    }

    const webinarId = dataMicrosite.WebinarId;

    if (webinarId != null) {
      const dataWebinar = await model.Webinar.findOne({
        where: {
          id: webinarId,
        },
      });

      const pathImg = dataWebinar.image;

      // hapus gambar webinar
      fs.unlink(`${process.cwd()}/${pathImg}`, (err) => {
        if (err) {
          const error = new Error('Fail deleted an image file');
          error.statusCode = 500;
          throw error;
        }
      });

      // hapus data webinar
      await model.Webinar.destroy({
        where: {
          id: webinarId,
        },
      });
    }

    // hapus data link
    await model.Microsite.destroy({
      where: {
        id: linkId,
      },
    });

    res.status(200);
    res.json({
      message: 'Successfully deleted link data',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postLinkController,
  getAllLinksController,
  putLinkByIdController,
  deleteLinkByIdController,
};
