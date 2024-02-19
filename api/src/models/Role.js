const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (database) => {
  // defino el modelo
  database.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hardSkills: {
      type: DataTypes.JSON,
      allowNull: false
    },
    softSkills: {
      type: DataTypes.JSON,
      allowNull: true
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true
    },
    remote: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fatherRoleId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },{
    timestamps: false
  });
};