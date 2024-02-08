'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addIndex('forge_attempts', ["slot"], { name: "ix_forge_attempts_slot" });
    queryInterface.addIndex('forge_attempts', ["guesser"], { name: "ix_forge_attempts_guesser" });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeIndex('forge_attempts', "ix_forge_attempts_slot");
    queryInterface.removeIndex('forge_attempts', "ix_forge_attempts_guesser");
  }
};
