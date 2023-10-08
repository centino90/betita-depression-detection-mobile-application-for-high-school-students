'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,        
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      age: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Male', 'Female']
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      symptom: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ['minimal', 'mild', 'moderate', 'moderately severe', 'severe']
      },
      answer: {        
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      isNotified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isNotificationConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: { 
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};