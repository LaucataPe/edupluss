const { DataTypes } = require("sequelize");
module.exports = (database) => {
  database.define(
    "Activity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hasTest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      durationTest: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberSteps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      formURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      excelURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
