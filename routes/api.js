
'use strict';

/** MY PERSONAL STYLE IS TO USE "CONST" SIGNAL TO OTHER DEVELOPERS READING THIS CODE
 *  THAT THOSE OBJECTS OR VARIABLES SHOULD NOT CHANGE THROUGHOUT THE REST OF THE CODE
 * 
 *  */

const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');
const bookshopController = require('../controllers/bookshopController');
const reviewController = require('../controllers/reviewController');

/**
 * Book API
 */
router.post('/addBook', bookController.createBook);
router.get('/books', bookController.listBooks);
router.get('/find', bookController.findBook);
router.put('/books/:bookId/edit', bookController.updateBook);
router.post('/books/:bookId/rate', reviewController.rateBook);
router.post('/books/:bookId/delete', bookController.deleteBook);

/**
 * Bookshop API:
 */
router.post('/newBookshop', bookshopController.addBookshop);

module.exports = router;
