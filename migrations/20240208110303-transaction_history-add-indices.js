'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('transaction_history', ["slot"], { name: "ix_transaction_history_slot" });
    await queryInterface.addIndex('transaction_history', ["fee_payer"], { name: "ix_transaction_history_fee_payer" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('transaction_history', "ix_transaction_history_slot");
    await queryInterface.removeIndex('transaction_history', "ix_transaction_history_fee_payer");
  }
};
