'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class election extends Model {
  };
  election.associate = function(models){
    election.hasMany(models.party,{
      foreignKey:'electionId'
    });
    election.hasMany(models.submission,{
      foreignKey:'electionId'
    });
  }
  election.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'election',
  });
  return election;
};