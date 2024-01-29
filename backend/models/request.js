"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Request.belongsTo(models.Status, { foreignKey: "statusID" });
      models.Status.hasMany(Request);

      Request.belongsTo(models.Category, { foreignKey: "categoryID" });
      models.Category.hasMany(Request);

      Request.belongsTo(models.User, { foreignKey: "userID" });
      models.User.hasMany(Request);

      Request.hasMany(models.Comment, { foreignKey: "requestID" });
      Request.hasMany(models.Like, {
        foreignKey: "requestID",
        onDelete: "CASCADE",
      });

      Request.hasMany(models.Comment, {
        foreignKey: "requestID",
        onDelete: "CASCADE",
      });
    }
  }
  Request.init(
    {
      title: DataTypes.STRING,
      bodyText: DataTypes.TEXT,
      statusID: DataTypes.INTEGER,
      categoryID: DataTypes.INTEGER,
      userID: DataTypes.INTEGER,
      merged: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Request",
    }
  );
  return Request;
};
