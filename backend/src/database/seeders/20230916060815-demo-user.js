'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'student1@test.com',
        password: await bcrypt.hash('password', 10),
        age: 15,
        gender: 'Male',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        answer: [0, 1, 2, 3, 0, 1, 2, 3, 0],
        symptom: 'moderate'
      },
      {
        email: 'student2@test.com',
        password: await bcrypt.hash('password', 10),
        age: 16,
        gender: 'Female',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        answer: [0, 0, 0, 3, 0, 0, 0, 3, 0],
        symptom: 'mild'
      },
      {
        email: 'admin@test.com',
        password: await bcrypt.hash('password', 10),
        age: 20,
        gender: 'Male',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
