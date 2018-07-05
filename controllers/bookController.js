'use strict'

const shortid = require('shortid-36');
const Promise = require('bluebird');
const models = require('../models');
const errorResolver = require('../handlers/errorHandlers');
const weightedMean = require('../handlers/ratings');


/**
 * @description Returns a book by its ID
 * @return {array} res. An array of user objects.
 */
exports.findBook = async (req, res) => {
  const [bookId] = [req.query.bookId];

  const query = {
    where: { id: bookId },
    include: [{
      model: models.review,
    }],
  };

  try {
    const book = await models.book.findOne(query);
    if (book) {
      return res.status(200).json({
        books: book,
      });
    }
    return res.status(500).json({
      code: 304,
      message: 'Book wasnt found',
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: errorResolver.resolve(err),
    });
  }
};

/**
 * @description Returns a lists of books; It filters according to their ratings. If there is no rating it assumes 0
 * @param {object} req.query.rating
 * @return {array} res. An array of user objects.
 */
/* USING A PROMISE/COROUTINE PATTERN HERE INSTEAD OF AN ASYNC.
*/

exports.listBooks =  (req, res) => {
  let rating = req.query.rating || 0; /** Default rating is  */
  rating = Math.ceil(rating);

  if (rating > 10 || rating < 1) {
    return res.status(400).json({
      message: 'Please input ratings between 1 and 10',
      code: 400,
    });
  }

  Promise.coroutine(function* () {
    const query = {
      include: [{
        model: models.review,
      }],
    };

    try {
      const books = yield models.book.findAll(query);
      books = books.map((book) => {
        const weightedArray = [];
        return Object.assign({}, {
          id: book.id,
          name: book.name,
          description: book.description,
          price: book.price,
          reviews: book.reviews.map((review) => {
            weightedArray.push(review.rating);
            return Object.assign({}, {
              id: review.id,
              book_id: review.book_id,
              review: review.review,
              rating: review.rating,
              name: review.name,
            });
          }),
          reviewAverage: book.reviews.length === 0 ? 'Not Reviewed Yet' : getMeanAverage(weightedArray),
        });

        function getMeanAverage(weightedArray) {
          let weightedValue = 0;
          for (let i = 0; i < weightedArray.length; i + 1) {
            const weight = weightedMean.findWeightedMean(weightedArray[i]);
            weightedValue += weightedArray[i] * weight;
          }
          const i = (weightedValue / weightedArray.length).toPrecision(2);
          return (i);
        }
      });

      books = books.map((book) => {
        if (book.reviewAverage >= rating) {
          return book;
        }
      });
      return res.status(200).json({
        code: 200,
        books: books,
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        error: errorResolver.resolve(err),
      });
    }
  })();
};

/**
 * @description Function creates a new book. If there is a bookshop indicated. It adds to the bookshop as to say the book is "available at stores".
 * @param {*} req.body
 * @param {*} res
 */

exports.createBook = async (req, res) => {
  const [bookshopId, bookName, bookDescription, bookPrice] = [req.body.bookshopId,
    req.body.name, req.body.description, req.body.price];

  const query = {
    id: shortid.generate().toLowerCase(),
    name: bookName,
    description: bookDescription,
    price: parseInt(bookPrice, 10),
  };

  try {
    const newBook = await models.book.create(query);
    const bookshop = await models.bookshop.findById(bookshopId);
    if (newBook && bookshop) {
      await newBook.addBookshop(bookshopId);
      return res.status(200).json({
        message: 'The book has been created and added to bookshop!',
        code: 200,
      });
    }
    if (!bookshop) {
      console.log('A user tried to store book but bookshop does not exist');
    }
    return res.status(200).json({
      message: 'The book has been created',
      code: 200,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      error: errorResolver.resolve(err),
    });
  }
};

/**
 * @description Function updates a book.
 * @param {*} req.body
 * @param {*} res
 */

exports.updateBook = async (req, res) => {
  const [bookId] = [req.params.bookId];
  const query = req.body;
  try {
    const book = await models.book.findById(bookId);
    if (book) {
      const updatedBook = await models.book.update(query, {
        where: {
          id: bookId,
        },
      });
      if (updatedBook >= 1) {
        return res.status(200).json({
          message: 'The Book has been updated',
          code: 200,
        });
      }
      if (updatedBook === 0) {
        return res.status(304).json({
          message: 'No book was updated',
          code: 304,
        });
      }
    }
    return res.status(304).json({
      message: 'Book could be found!',
      code: 304,
    });
  } catch (error) {
    return res.status(500).json({
      message: `An error occured ${error.message}`,
      code: 500,
    });
  }
};

/**
 * @description Function deletes a book.
 * @param {*} req.body
 * @param {*} res
 */

exports.deleteBook = async (req, res) => {
  const [bookId] = [req.params.bookId];

  try {
    const book = await models.book.findById(bookId);
    if (book) {
      const deletedBook = await models.book.destroy({
        where: {
          id: bookId,
        },
      });

      if (deletedBook === 1) {
        return res.status(200).json({
          message: `Book ${bookId} has been deleted!`,
          code: 200,
        });
      }

      if (deletedBook === 0) {
        return res.status(400).json({
          message: 'The book was not deleted',
          code: 400,
        });
      }
    }

    return res.status(304).json({
      message: 'Book could be found!',
      code: 304,
    });
  } catch (error) {
    return res.status(500).json({
      message: `An error occured ${error.message}`,
      code: 500,
    });
  }
};
