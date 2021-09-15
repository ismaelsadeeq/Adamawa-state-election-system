'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pollingUnits', {
      id: {
        type: Sequelize.UUID,
        allowNull:false,
        unique:true,
        type:Sequelize.UUID
      },
      lgaId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'lgas',
          key:'id',
          as:'lgaId'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      puNumber:Sequelize.STRING,
      voters: {
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
    await queryInterface.dropTable('pollingUnits');
  }
};