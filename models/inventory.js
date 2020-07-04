'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      Inventory.belongsTo(models.User, { foreignKey: 'user_id' })
      Inventory.belongsTo(models.AllCharacter, { foreignKey: 'chara_id' })
    }
  };
  Inventory.init({
    user_id: DataTypes.INTEGER,
    chara_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};