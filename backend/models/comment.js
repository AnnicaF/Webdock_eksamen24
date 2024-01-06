"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "userID" });
      models.User.hasMany(Comment);

      Comment.belongsTo(models.Request, {
        foreignKey: "requestID",
        onDelete: "CASCADE",
      });
      models.Request.hasMany(Comment, { onDelete: "CASCADE" });
    }
  }

  Comment.init(
    {
      bodyText: DataTypes.TEXT,
      userID: DataTypes.INTEGER,
      requestID: DataTypes.INTEGER,
      isMerged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );

  return Comment;
};
