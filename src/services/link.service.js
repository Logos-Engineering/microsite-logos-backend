const fs = require('fs');

const {
  Category,
  Webinar,
  Microsite,
} = require('../models/index');

const { ClientErrors, NotFoundError } = require('../middlewares/error');

// jika tidak ada, return null
async function isMicrositeDataExist(id) {
  const dataMicrosite = await Microsite.findOne({
    where: {
      id,
    },
  });
  return dataMicrosite;
}

async function addWebinar({ title, image, summary }) {
  if (!image) {
    return Promise.reject(new ClientErrors('Image has to upload'));
  }
  // simpan payload data webinar ke tabel webinar
  const webinar = await Webinar.create({
    title,
    image,
    summary,
  });

  return webinar.id;
}

async function updateWebinar({ linkId, title, image, summary }) {
  if (!image) {
    return Promise.reject(new ClientErrors('Image has to upload'));
  }
  const dataMicrosite = await isMicrositeDataExist(linkId);
  if (!dataMicrosite) {
    const error = new NotFoundError('The data is not found');
    return Promise.reject(error);
  }
  const dataWebinar = await Webinar.findOne({
    where: {
      id: dataMicrosite.WebinarId,
    },
  });
    // menghapus gambar yang lama
  fs.unlink(`${process.cwd()}/${dataWebinar.image}`, (err) => {
    if (err) {
      return Promise.reject(new NotFoundError('The data is not found'));
    }
  });

  dataWebinar.title = title;
  dataWebinar.image = image;
  dataWebinar.summary = summary;

  // perbarui data webinar
  return dataWebinar.save();
}

async function addLink(payloadArg) {
  const {
    name,
    link,
    publish,
    category,
    WebinarId,
  } = payloadArg;

  // cari atau buat kategori
  const categoryId = await Category.findOrCreate({
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
    WebinarId,
  };

  return Microsite.create(payload);
}

function getAllLinks() {
  return Microsite.findAll({
    attributes: ['id', 'name', 'link', 'publish'],
    include: [{
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

async function updateLink({
  name,
  link,
  publish,
  category,
  linkId,
}) {
  // cek data link berdasarkan parameter id
  const dataMicrosite = await isMicrositeDataExist(linkId);
  if (!dataMicrosite) {
    const error = new NotFoundError('The data is not found');
    return Promise.reject(error);
  }

  // dapatkan atau buat categori
  const categoryId = await Category.findOrCreate({
    where: {
      name: category,
    },
  });

  dataMicrosite.name = name;
  dataMicrosite.link = link;
  dataMicrosite.publish = publish;
  dataMicrosite.CategoryId = categoryId[0].id;
  return dataMicrosite.save();
}

async function deleteLink(id) {
  const micrositeData = await isMicrositeDataExist(id);
  if (!micrositeData) {
    const error = new NotFoundError('The data is not found');
    return Promise.reject(error);
  }

  const webinarId = micrositeData.WebinarId;

  if (webinarId != null) {
    const dataWebinar = await Webinar.findOne({
      where: {
        id: webinarId,
      },
    });

    const pathImg = dataWebinar.image;

    // hapus gambar webinar
    fs.unlink(`${process.cwd()}/${pathImg}`, (err) => {
      if (err) {
        return Promise.reject(new NotFoundError('The data is not found'));
      }
    });

    // hapus data webinar
    await Webinar.destroy({
      where: {
        id: webinarId,
      },
    });
  }

  return Microsite.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  addLink,
  addWebinar,
  getAllLinks,
  updateLink,
  updateWebinar,
  deleteLink,
};
