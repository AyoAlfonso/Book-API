'use strict'

module.exports = (sequelize, DataTypes)=> {
  const Review = sequelize.define('review', {
    id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    // autoIncrement: true,
    },
    book_id: {
      type: DataTypes.STRING(14),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Book ID cannot be empty',
        },
      },
    },
    review: { // IS NOT SET TO allowNull:false BECAUSE SOME USERS MIGHT JUST WANT TO LEAVE A RATING WITHOUT THE AN TEXT REVIEW
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
    },
    name: { // THIS IS THE NAME OF THE CUSTOMER REVIEWING THE BOOK
      allowNull: false,
      type: DataTypes.STRING(120),
    },
  });
  return Review;
};
