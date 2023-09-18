'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Questionnaires', [
      {      
        title: 'PHQ 1',
        description: 'lorem ipsum',
        questions: [
          'question 1',
          'question 2',
          'question 3',
          'question 0'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {      
        title: 'PHQ 2',
        description: 'lorem ipusm',
        questions: [
          'question 1',
          'question 2',
          'question 3',
          'question 0'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: new Date()
      }      
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questionnaires', null, {});
  }
};

