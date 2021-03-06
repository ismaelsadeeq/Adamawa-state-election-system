'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('elections', {
      id: {
        type: Sequelize.UUID,
        allowNull:false,
        unique:true,
        type:Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('elections');
  }
};