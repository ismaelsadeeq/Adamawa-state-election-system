'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class party extends Model {
  };
  party.associate = function(models){
    party.belongsTo(models.election,{
      foreignKey:'electionId'
    });
  }
  party.init({
    name: DataTypes.STRING,
    contestantName: DataTypes.STRING,
    votes: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'party',
  });
  return party;
};