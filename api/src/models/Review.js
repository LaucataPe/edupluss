const { DataTypes } = require("sequelize");

  module.exports = (database) => {  
  database.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.ENUM('0', '1', '2', '3', '4', '5'),
      allowNull: false,
    },
    reviewRated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    }},
    {
      timestamps: false,
    }
  );
};
