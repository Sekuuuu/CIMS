// migrations/YYYYMMDDHHMMSS-add-worker-assignment-to-issues.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Issues", "assignedWorkerId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    });
    await queryInterface.addColumn("Issues", "assignedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Issues", "assignedWorkerId");
    await queryInterface.removeColumn("Issues", "assignedAt");
  },
};
