const { DataTypes } = require('sequelize');
module.exports = (database) => {
  database.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hasTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    numberSteps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },{
    timestamps: false
  });
};