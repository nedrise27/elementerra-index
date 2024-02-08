'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transaction_history', "transaction_error", Sequelize.BOOLEAN);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transaction_history', "transaction_error")
  }
};
