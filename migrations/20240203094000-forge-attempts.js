'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forge_attempts', {
      tx: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      slot: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      guesser: {
        type: Sequelize.STRING,
      },
      is_invention: {
        type: Sequelize.BOOLEAN,
      },
      has_failed: {
        type: Sequelize.BOOLEAN,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forge_attempts')
  }
};
