module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'password');
  }
};
