'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessHours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BusinessHours.init({
    businessId: DataTypes.INTEGER,
    day: DataTypes.STRING,
    opening_time: DataTypes.TIME,
    closing_time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'BusinessHours',
  });
  return BusinessHours;
};