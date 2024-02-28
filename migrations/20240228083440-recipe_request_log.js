'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_request_log', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      elements: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe_request_log')
  }
};
