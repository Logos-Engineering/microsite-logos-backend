/* eslint-disable no-undef */
const {
  addLink,
  getAllLinks, updateLink, updateWebinar, deleteLink,
  addWebinar,
} = require('../services/link.service');

async function postLinkController(req, res, next) {
  // mengambil payload yang telah lolos dari validator
  const {
    name,
    link,
    publish,
    category,
    title,
    summary,
  } = req.body;

  try {
    const linkPayload = {
      name,
      link,
      publish,
      category,
    };

    const webinarPayload = {
      title,
      summary,
    };

    // periksa jika kategori = webinar
    // maka simpan gambar yang diupload
    if (category === 'webinar') {
      webinarPayload.image = req.file ? req.file.path : null;
      const webinarId = await addWebinar(webinarPayload);
      // sisipkan id webinar ke payload link
      linkPayload.WebinarId = webinarId;
    }

    // menyimpan data link ke DB
    const result = await addLink(linkPayload);
    res.status(201);
    res.json({
      data: {
        id: result.id,
        name: result.name,
        link: result.link,
        publish: result.publish,
        category,
        // jika webinar ada maka tambahkan property title, image, summary
        ...category === 'webinar' && { title: webinarPayload.title },
        ...category === 'webinar' && { image: webinarPayload.image },
        ...category === 'webinar' && { summary: webinarPayload.summary },
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAllLinksController(req, res, next) {
  try {
    const result = await getAllLinks();

    // menyusun data link
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
    title,
    summary,
  } = req.body;
  const linkId = req.params.id;

  try {
    let webinarData;
    const linkPayload = {
      name,
      link,
      publish,
      category,
      linkId,
    };
    const webinarPayload = {
      linkId,
      title,
      summary,
    };

    if (category === 'webinar') {
      webinarPayload.image = req.file ? req.file.path : null;
      // perbarui data webinar
      webinarData = await updateWebinar(webinarPayload);
    }

    // perbarui data link
    const result = await updateLink(linkPayload);
    res.status(200);
    res.json({
      data: {
        id: result.id,
        name: result.name,
        link: result.link,
        publish: result.publish,
        category,
        ...category === 'webinar' && { title: webinarData.title },
        ...category === 'webinar' && { image: webinarData.image },
        ...category === 'webinar' && { summary: webinarData.summary },
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteLinkByIdController(req, res, next) {
  const linkId = req.params.id;
  try {
    await deleteLink(linkId);
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
