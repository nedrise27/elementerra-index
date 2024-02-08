'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nft_prices', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      mint: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      collection: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      level: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      price_in_sol: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('nft_prices')
  }
};
