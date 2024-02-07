'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forge_attempts', "add_to_pending_guesses", Sequelize.ARRAY(Sequelize.STRING));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forge_attempts', "add_to_pending_guesses")
  }
};
