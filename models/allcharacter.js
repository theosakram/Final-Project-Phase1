'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AllCharacter extends Model {
    static associate(models) {
      AllCharacter.hasMany(models.Inventory, { foreignKey: 'chara_id' })
    }
  };
  AllCharacter.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    grade: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        checkGrade(value) {
          let grade = ['SSR', 'SR', 'R', 'UC', 'C']
          let count = 0
          for (let i = 0; i < grade.length; i++) {
            if (value === grade[i]) count++
          }
          if (count === 0) throw new Error('Wrong grade format')
        }
      }
    }, count: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    hooks: {
      beforeUpdate: (instance, options) => {
        if (instance.count === 0) {
          instance.count = 10
        }
      }, afterUpdate: (instance, options) => {
        if (instance.count < 0) {
          instance.count = 10
        }
      }
    },
    modelName: 'AllCharacter',
  });
  return AllCharacter;
};