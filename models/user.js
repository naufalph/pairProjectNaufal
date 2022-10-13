"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const robohashAvatars = require("robohash-avatars");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post);
      User.hasMany(models.Comment);
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.STRING,
      profileURL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (instance,options) => {
          instance.createdAt = new Date();
          instance.updatedAt = new Date();
          const salt = bcrypt.genSaltSync(6);
          const hash = bcrypt.hashSync(instance.password, salt);
          instance.password = hash;
          instance.profileURL = robohashAvatars.generateAvatar({
            username: instance.username,
            background: robohashAvatars.BackgroundSets.RandomBackground1,
            characters: robohashAvatars.CharacterSets.DisembodiedHeads,
            height: 400,
            width: 400,
          }); 
        },
      },
    }
  );
  return User;
};
