'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('forge_attempts', ["slot"], { name: "ix_forge_attempts_slot" });
    await queryInterface.addIndex('forge_attempts', ["guesser"], { name: "ix_forge_attempts_guesser" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('forge_attempts', "ix_forge_attempts_slot");
    await queryInterface.removeIndex('forge_attempts', "ix_forge_attempts_guesser");
  }
};
