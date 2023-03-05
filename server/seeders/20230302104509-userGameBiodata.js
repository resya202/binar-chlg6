'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('userGameBiodata', [{
        userId: 1,
        fullName: 'User 1',
        email: 'user1@mail.com',
        dateofbirth: new Date(2002, 5, 22),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        fullName: 'User 2',
        email: 'user2@mail.com',
        dateofbirth: new Date(2003, 3, 3),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        fullName: 'User 3',
        email: 'user3@mail.com',
        dateofbirth: new Date(2007, 1, 6),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {}
};