'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('interest_accruals', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wallets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      accrued_for_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      principal: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      interest: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      annual_rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex(
      'interest_accruals',
      ['wallet_id', 'accrued_for_date'],
      { unique: true, name: 'interest_accruals_wallet_date_unique' },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('interest_accruals');
  },
};
