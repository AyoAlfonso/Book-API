
const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Bookworm API!',
    code: 200,
  });
});

router.get('/list', bookController.listBooks);

module.exports = router;
