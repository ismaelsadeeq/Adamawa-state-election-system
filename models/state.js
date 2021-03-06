'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class state extends Model {
  };
  state.associate = function(models){
    state.hasMany(models.lga,{
      foreignKey:'stateId'
    });
  }
  state.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'state',
  });
  return state;
};