'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addIndex('transaction_history', ["slot"], { name: "ix_transaction_history_slot" });
    queryInterface.addIndex('transaction_history', ["fee_payer"], { name: "ix_transaction_history_fee_payer" });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeIndex('transaction_history', "ix_transaction_history_slot");
    queryInterface.removeIndex('transaction_history', "ix_transaction_history_fee_payer");
  }
};
