'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userGameBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userGameBiodata.belongsTo(models.userGame, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  userGameBiodata.init({
    userId: DataTypes.INTEGER,
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full Name is required"
        },
        len: {
          args: [5, 20],
          msg: "Full Name must be between 5 and 20 characters"
        }
      }
    },
    email: DataTypes.STRING,
    dateofbirth: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'userGameBiodata',
  });
  return userGameBiodata;
};