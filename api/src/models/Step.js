const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Step', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
    },
        description:{
      type: DataTypes.STRING,
    },    description:{
      type: DataTypes.STRING,
    },
        description:{
      type: DataTypes.STRING,
    },
    design:{
      type:DataTypes.STRING,
      defaultValue: 'row'
    },
    video: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  },{
    timestamps: false,
  });
};
