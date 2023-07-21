'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the 'location' column
    await queryInterface.removeColumn('Businesses', 'location');

    // Add the 'longitude' and 'latitude' columns
    await queryInterface.addColumn('Businesses', 'longitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('Businesses', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert the changes if needed
    await queryInterface.addColumn('Businesses', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('Businesses', 'longitude');
    await queryInterface.removeColumn('Businesses', 'latitude');
  }
};
