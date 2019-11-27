const createModel = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    date_time: DataTypes.DATE,
  }, {});
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'user_Id',
      as: 'owner',
    });
  };
  return Task;
};
export default createModel;
