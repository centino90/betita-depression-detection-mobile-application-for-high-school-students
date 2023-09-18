'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userQuestionnairesData = [
      { userId: 1, questionnaireId: 1, answers: [1, 2, 3, 0], createdAt: new Date(), updatedAt: new Date(), },
      { userId: 2, questionnaireId: 2, answers: [1, 2, 3, 0], createdAt: new Date(), updatedAt: new Date(), }
    ];
    await queryInterface.bulkInsert('UserQuestionnaires', userQuestionnairesData, {});
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('UserQuestionnaires', null, {});
  }
};
