const { DataTypes, STRING, NUMBER, INTEGER } = require('sequelize');
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
      type: DataTypes.ARRAY(STRING),
      allowNull: false
    },
    softSkills: {
      type: DataTypes.ARRAY(STRING)
    },
    schedule: {
      type: DataTypes.STRING
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.ARRAY(INTEGER),
      allowNull: false
    },
    remote: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },{
    timestamps: false
  });
};