export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'Users',
      'username',
      {
        type: Sequelize.STRING,
        unique: true,
      },
    );
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Users',
      'username',
      {
        type: Sequelize.STRING,
        unique: false,
      },
    );
  },
};
