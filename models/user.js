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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: `username is required`,
          },
          notEmpty: {
            args: true,
            msg: `username is required`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: `password is required`,
          },
          notEmpty: {
            args: true,
            msg: `password is required`,
          },
          len:{
            args: [2,10],
            msg: `invalid password length (2-10 chars)`
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: `email is required`,
          },
          notEmpty: {
            args: true,
            msg: `email is required`,
          },
          isEmail: {
            args:true,
            msg:`invalid email address`
          }
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAllowedAdmin(value) {
            if(value === "admin"){
              if(!this.password.includes("1.2.3.")){
                throw new Error("Only authorize are allowed to be an admin!");
              }
            }
          }
        },
      },
      profileURL: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (instance, options) => {
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
