const createModel = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    dateTime: {
      type: DataTypes.DATE,
      field: 'date_time',
    },
  }, {});
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'owner',
    });
  };
  return Task;
};
export default createModel;
