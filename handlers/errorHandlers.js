/*
A personal preference to have a folder to handle errors.
*/

const _ = require('lodash');
exports.resolve = (err) => {
  function getCastError(item) {
    const [value, path] = [item.value, item.path];
    return { message: `The id value of ${value} provided for field ${path} is invalid` };
  }

  let errors = [];
  if (err.name === 'ValidationError') {
    errors = _.flatten(_.map(err.errors, (item) => {
      if (item.name === 'CastError') {
        return getCastError(item);
      }
      return { message: item.message };
    }));
  } else if (err.name === 'CastError') {
    errors.push(err);
  } else if (err.name === 'MongoError') { // HOWEVER WE ARE NOT USING MONGODB FOR CONNECTING
    if (err.code === 11000) {
      errors.push({ message: 'Duplicate index error happened.' });
    }
  } else {
    errors.push({ message: err.message });
  }
  return errors;
};

exports.developmentErrors = (err, req, res) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
  });
};

exports.productionErrors = (err, req, res) => {
  res.status(err.status || 500);
  res.render('hello', {
    message: err.message,
    error: {},
  });
};
