const router = require('express').Router();
const db = require('../models/index');

/**
 * Get all links based on publishing column
 * @return array of object
 */
 router.get('/', async (req, res) => {
  try {
    // Find all links on the microsite table which publish column is true
    const dataLinks = await db.Microsite.findAll({
      attributes: ['name', 'link'],
      where: {
        publish: true
      },
      include: [
        {
          model: db.Category,
          attributes: ['name'],
        },
        {
          model: db.Webinar,
          attributes: ['title', 'image', 'summary']
        }
      ]
    });

    let reconstructData = [];

    if(dataLinks.length > 0) {
      // Grouping value of property based on category
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
});

module.exports = router;