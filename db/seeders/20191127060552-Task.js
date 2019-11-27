export default {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Tasks',
      [
        {
          user_id: 1,
          name: 'establish a religion',
          description: 'lets name it scientology',
          date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          name: 'new dace step',
          description: 'improve moon walk somehow',
          date_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Tasks', null, {});
  },
};
