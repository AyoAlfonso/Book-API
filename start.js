require('dotenv').config();
const app = require('./app');
const models = require('./models');

/* A lot of repitition in this initilization below but its important to maintain consistency across the tables */
models.book.belongsToMany(models.bookshop, { through: 'BooksInBookshops', onDelete: 'cascade' });
models.review.belongsTo(models.book, { foreignKey: 'book_id' });

models.bookshop.belongsToMany(models.book, { through: 'BooksInBookshops', onDelete: 'cascade' });
models.book.hasMany(models.review, { foreignKey: 'book_id' });

const getdbMode = {
  development: {},
  production: { force: true },
};

try {
  console.log('Here at sequelize sync');
  models.sequelize.sync(getdbMode[process.env.NODE_ENV]).then((results) => {
    const server = app.listen(app.get('port'), () => {
      console.log(`Our app is running at this PORT ${app.get('port')} 📚`);
    });
    server.on('error', onError);
  }, (error)=> {
    console.log(error.message);
  });
} catch (error) {
  console.log(` Hi 🤨 ${error.message}`);
  console.error(` Hi 🤨 ${error.message}`);
}

function onError(error) {
  const port = app.get('port');
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(` Hi 🤨 ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Hi ${bind} is already in use 🙃`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
