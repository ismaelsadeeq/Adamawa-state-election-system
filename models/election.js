'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class election extends Model {
  };
  election.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'election',
  });
  return election;
};