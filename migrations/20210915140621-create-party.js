'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('parties', {
      id: {
        type: Sequelize.UUID,
        allowNull:false,
        unique:true,
        type:Sequelize.UUID
      },
      electionId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'elections',
          key:'id',
          as:'electionId'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      contestantName: {
        type: Sequelize.STRING
      },
      votes: {
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
    await queryInterface.dropTable('parties');
  }
};