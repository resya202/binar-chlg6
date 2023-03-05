'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userGameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userGameHistory.belongsTo(models.userGame, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  userGameHistory.init({
    userId: DataTypes.INTEGER,
    game: DataTypes.STRING,
    score: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    lastLogin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'userGameHistory',
  });
  return userGameHistory;
};