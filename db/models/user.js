const createModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
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
