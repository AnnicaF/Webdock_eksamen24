"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bodyText: {
        type: Sequelize.TEXT,
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      requestID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Requests",
          key: "id",
        },
      },
      isMerged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("Comments", {
      fields: ["userID"],
      type: "foreign key",
      name: "fk_comment_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Comments", {
      fields: ["requestID"],
      type: "foreign key",
      name: "fk_comment_request",
      references: {
        table: "Requests",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
