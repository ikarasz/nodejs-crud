const createModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: 'user_id',
      as: 'tasks',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
export default createModel;
