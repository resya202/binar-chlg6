'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('userGames', [{
        username: 'User 1',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'User 2',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'User 3',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down(queryInterface, Sequelize) {}
};