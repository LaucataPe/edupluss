const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (database) => {
  // defino el modelo
  database.define('UserActivityStep', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stepId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },{
    timestamps: false
  });
};