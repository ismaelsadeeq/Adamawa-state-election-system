'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class submission extends Model {
  };
  submission.associate = function(models){
    submission.belongsTo(models.pollingUnit,{
      foreignKey:'pollingUnitId'
    });
    submission.belongsTo(models.party,{
      foreignKey:'partyId'
    });
    submission.belongsTo(models.election,{
      foreignKey:'electionId'
    });
  }
  submission.init({
    votes: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'submission',
  });
  return submission;
};