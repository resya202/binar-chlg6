'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('userGameHistories', [{
        userId: '1',
        game: 'countestrike',
        score: '150',
        level: '50',
        lastLogin: new Date(2024, 1, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '1',
        game: 'CS16',
        score: '11',
        level: '100',
        lastLogin: new Date(2021, 4, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '2',
        game: 'dota',
        score: '20',
        level: '190',
        lastLogin: new Date(2023, 2, 5),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '2',
        game: 'counter strike',
        score: '130',
        level: '200',
        lastLogin: new Date(2022, 9, 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '3',
        game: 'suit',
        score: '100',
        level: '20',
        lastLogin: new Date(2024, 6, 28),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '3',
        game: 'AQW',
        score: '70',
        level: '555',
        lastLogin: new Date(2025, 3, 19),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {}
};