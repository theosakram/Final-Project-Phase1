'use strict';

const {
  Model
} = require('sequelize');
const { encrypt } = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Inventory, { foreignKey: 'user_id' })
    }
  };
  User.init({
    nickname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [5],
        isAlphanumeric: true
      }
    },
    diamond: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    sequelize,
    hooks: {
      beforeCreate: (user) => {
        user.password = encrypt(user.password);
      }
    },
    modelName: 'User',
  });
  return User;
};