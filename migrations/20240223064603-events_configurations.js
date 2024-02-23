'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events_configurations', {
      guesser: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      enable_events: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events_configurations')
  }
};
