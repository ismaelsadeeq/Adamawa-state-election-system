'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pollingUnit extends Model {
  };
  pollingUnit.associate = function(models){
    pollingUnit.belongsTo(models.lga,{
      foreignKey:'lgaId'
    })
  }
  pollingUnit.init({
    name: DataTypes.STRING,
    voters: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'pollingUnit',
  });
  return pollingUnit;
};