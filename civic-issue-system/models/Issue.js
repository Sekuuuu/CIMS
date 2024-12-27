// models/Issue.js
module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    "Issue",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "open",
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 7 },
        defaultValue: null,
      },
      latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
      photoUrl: DataTypes.STRING,
      assignedWorkerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assignedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Issue.associate = (models) => {
    Issue.belongsTo(models.User, { foreignKey: "userId" });
    Issue.belongsTo(models.User, {
      foreignKey: "assignedWorkerId",
      as: "assignedWorker",
    });
    Issue.hasMany(models.Comment, { foreignKey: "issueId" });
    Issue.hasMany(models.Notification, { foreignKey: "issueId" });
    Issue.hasMany(models.AdminActionLog, { foreignKey: "issueId" });
  };

  return Issue;
};
