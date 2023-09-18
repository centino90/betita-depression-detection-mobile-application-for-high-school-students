'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Questionnaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Questionnaire.belongsToMany(models.User, {
        through: 'UserQuestionnaires',
        foreignKey: 'questionnaireId',
        as: 'users',
      });
    }
  }
  Questionnaire.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    questions: DataTypes.ARRAY, // Not at all = 0, A few days = 1, More than half the days = 2, and Almost every day = 3
    archivedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Questionnaire',
  });
  return Questionnaire;
};