'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lga extends Model {
  };
  lga.associate = function(models){
    lga.belongsTo(models.state,{
      foreignKey:'stateId'
    })
    lga.hasMany(models.pollingUnit,{
      foreignKey:'lgaId'
    })
  }
  lga.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'lga',
  });
  return lga;
};