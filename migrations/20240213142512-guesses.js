'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('guesses', {
      address: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      season_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      number_of_times_tried: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      is_success: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      element: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      recipe: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      creator: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('guesses')

  }
};
