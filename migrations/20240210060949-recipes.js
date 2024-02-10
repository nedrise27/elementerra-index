'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipes', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      elements: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      was_successful: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipes')
  }
};
