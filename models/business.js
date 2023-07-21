'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Business.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profileImgPath: DataTypes.STRING,
    description: DataTypes.TEXT,
    longitude: DataTypes.DECIMAL(10, 8),
    latitude: DataTypes.DECIMAL(10, 8)
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};