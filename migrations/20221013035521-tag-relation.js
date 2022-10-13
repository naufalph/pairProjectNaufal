"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Posts", "TagId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Tags",
        key: "id",
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Posts", "TagId", {});
  },
};
