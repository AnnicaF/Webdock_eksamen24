"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bodyText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      statusID: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: "Statuses",
          key: "id",
        },
      },
      categoryID: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      merged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("Requests", {
      fields: ["userID"],
      type: "foreign key",
      name: "fk_request_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Requests", {
      fields: ["statusID"],
      type: "foreign key",
      name: "fk_request_status",
      references: {
        table: "Statuses",
        field: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Requests", {
      fields: ["categoryID"],
      type: "foreign key",
      name: "fk_request_category",
      references: {
        table: "Categories",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Requests");
  },
};
