'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const routes = require('./routes/index');
const middleware = require('./middleware/index');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Added a security measure; For headers we are accpeting and the type of site origins we are accepting
*/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', middleware);
app.use('/', routes);
app.use('/api', apiRoutes);

app.get('/*', (req, res) => {
  res.status(304).json({
    message: 'This routes does not exist',
    code: 304,
 });
});

app.set('port', normalizePort(process.env.PORT || 4500));

function normalizePort(val) {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

module.exports = app;
