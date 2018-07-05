const shortid = require('shortid-36');
const models = require('../models');
const errorResolver = require('../handlers/errorHandlers');

/**
 * @description This function rates a specified book
 * @param {rating} req.body
 * @param {*} res
 */
exports.rateBook = async (req, res) => {
  const [bookId, rating, review, name] = [req.params.bookId, req.body.rating, req.body.review, req.body.customerName];

  if (!rating || rating > 10 || rating < 1) {
    return res.status(400).json({
      message: 'Please input an accepted rating',
      code: 400,
    });
  }

  const query = {
    id: shortid.generate().toLowerCase(),
    book_id: bookId,
    review,
    rating: Math.floor(parseInt(rating, 10)),
    name,
  };

  try {
    const book = await models.book.findById(bookId);
    if (book) {
      const bookReviewed = await models.review.create(query);
      if (bookReviewed) {
        return res.status(200).json({
          message: `The book ${bookId} has been reviewd`,
          code: 200,
        });
      }
    }
    return res.status(400).json({
      code: 400,
      error: 'The book was not found',
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: errorResolver.resolve(err),
    });
  }
};
