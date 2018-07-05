
const express = require('express');

const router = express.Router();

router.use('/', (req, res, next) => {
  console.log('Running base middleware...');
  const callingPath = req.path;
  const correctHeaders = req.get('Token') == process.env.REQUEST_HEADER_TOKEN &&
        req.get('Key') === process.env.REQUEST_HEADER_KEY;

  if (callingPath === 'api/books') {
    return next();
  }

  if (!correctHeaders) {
    return res.status(401).json({
      message: 'Unauthorized access',
      code: 401
    });
  }
  return next();
});

router.use('/newBookshop', (req, res, next) => {
  const geopoint = JSON.parse(req.body.geopoints);
  const isArray = Array.isArray(geopoint);

  if (isArray === true) {
    return next();
  } else {
    return res.status(400).json({
      message: 'You are not sending a valid array of coordinates to this route. Please retry with appropriate details',
      code: 400,
    });
  }
});
module.exports = router;
