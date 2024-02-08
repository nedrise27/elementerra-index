'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_history', {
      tx: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      slot: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fee_payer: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      contains_claim_instruction: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      contains_add_to_pending_guess_instruction: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      data: {
        allowNull: false,
        type: Sequelize.JSONB
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_history')
  }
};
