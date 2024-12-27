// models/Notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      message: { type: DataTypes.STRING, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      timestamps: true,
      updatedAt: false, // Notifications may not need an `updatedAt` timestamp
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "userId" });
    Notification.belongsTo(models.Issue, { foreignKey: "issueId" });
  };

  return Notification;
};
