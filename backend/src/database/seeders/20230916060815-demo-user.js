'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {      
        email: 'student1@test.com',
        password: await bcrypt.hash('password', 10),
        age: 15,
        gender: 'Male',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {      
        email: 'student2@test.com',
        password: await bcrypt.hash('password2', 10),
        age: 16,
        gender: 'Female',
        createdAt: new Date(),
        updatedAt: new Date()
      }      
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
