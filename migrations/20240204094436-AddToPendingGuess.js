'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('add_to_pending_guesses', {
      tx: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      slot: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      guesser: {
        type: Sequelize.STRING,
      },
      element_id: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "elements",
          key: "id"
        }
      },
      forge_attempt_tx: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "forge_attempts",
          key: "tx",
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('add_to_pending_guesses')
  }
};
