'use strict'

module.exports = (sequelize, DataTypes) => {
  const Bookshop = sequelize.define('bookshop', {
    id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    logo: {
      type: DataTypes.STRING(50),
      validate: {
        isUrl: {
          msg: 'Logo Must be a valid URL',
        },
      },
    },
    commercial_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Bookshop's commercial name can not be empty",
        },
      },
    },
    commercial_email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Commercial Mail Must be an Email',
        },
      },
    },
    bookshop_number: {
      type: DataTypes.INTEGER(15),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Bookshop Number Must be numeric',
        },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address must be not be empty',
        },
      },
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
    },
  });
  return Bookshop;
};
