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
    pollingUnit.hasMany(models.submission,{
      foreignKey:'pollingUnitId'
    })
  }
  pollingUnit.init({
    name: DataTypes.STRING,
    puNumber:DataTypes.STRING,
    voters: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'pollingUnit',
  });
  return pollingUnit;
};