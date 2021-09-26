'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('submissions', {
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
      pollingUnitId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'pollingUnits',
          key:'id',
          as:'pollingUnitId'
        }
      },
      partyId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'parties',
          key:'id',
          as:'partyId'
        }
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
    await queryInterface.dropTable('submissions');
  }
};