'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forge_attempts', "guess_address", Sequelize.STRING);
    await queryInterface.addColumn('forge_attempts', "guess", Sequelize.ARRAY(Sequelize.STRING));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forge_attempts', "guess");
    await queryInterface.removeColumn('forge_attempts', "guess_address");
  }
};
