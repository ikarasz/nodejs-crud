export default {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Users',
      [
        {
          username: 'tcruise',
          first_name: 'Tom',
          last_name: 'Cruise',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'jacko',
          first_name: 'Michael',
          last_name: 'Jackson',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
