'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('elements', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      symbol: {
        allowNull: false,
        type: Sequelize.STRING
      },
      forge_attempt_tx: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "forge_attempts",
          key: "tx",
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('elements');
  }
};