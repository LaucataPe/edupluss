const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (database) => {
  // defino el modelo
  database.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },{
    timestamps: false
  });
};