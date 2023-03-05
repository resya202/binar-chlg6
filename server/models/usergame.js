'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userGame.hasMany(models.userGameHistory, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      userGame.hasOne(models.userGameBiodata, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  userGame.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username is required"
        },
        len: {
          args: [5, 20],
          msg: "Username must be between 5 and 20 characters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required"
        },
        len: {
          args: [5, 20],
          msg: "Password must be between 5 and 20 characters"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'userGame',
  });
  return userGame;
};