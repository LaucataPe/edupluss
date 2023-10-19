const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (database) => {
  // defino el modelo
  database.define('UserStep', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    finished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },{
    timestamps: true
  });
};