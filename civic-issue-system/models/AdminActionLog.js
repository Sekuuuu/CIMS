// models/AdminActionLog.js
module.exports = (sequelize, DataTypes) => {
  const AdminActionLog = sequelize.define(
    "AdminActionLog",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      action: { type: DataTypes.STRING, allowNull: false },
      details: DataTypes.TEXT,
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );

  AdminActionLog.associate = (models) => {
    AdminActionLog.belongsTo(models.User, {
      foreignKey: "adminId",
      constraints: false,
    });
    AdminActionLog.belongsTo(models.Issue, { foreignKey: "issueId" });
  };

  return AdminActionLog;
};
