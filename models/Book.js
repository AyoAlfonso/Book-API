'use strict'

module.exports = (sequelize, DataTypes)=> {
  const Book = sequelize.define('book', {
    id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: {
          msg: 'Book price must be a decimal',
        },
      },
    },
  });
  return Book;
};
