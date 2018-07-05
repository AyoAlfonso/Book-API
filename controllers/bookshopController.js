const shortid = require('shortid-36');
const models = require('../models');
const errorResolver = require('../handlers/errorHandlers');

exports.addBookshop = async (req, res) => {

  const query = {
    id: shortid.generate().toLowerCase(),
    logo: req.body.logo,
    commercial_name: req.body.commercial_name,
    commercial_email: req.body.commercial_email,
    bookshop_number: req.body.phone_number,
    address: req.body.address,
  };

  try {
    const newBookshop = await models.bookshop.create(query);
    if (newBookshop) {
      return res.status(200).json({
        message: 'A new bookshop has been created !',
        code: 200,
      });
    }
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: errorResolver.resolve(err),
    });
  }
};
