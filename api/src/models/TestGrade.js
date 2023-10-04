const { DataTypes } = require("sequelize");

  module.exports = (database) => {  
  database.define('TestGrade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gradeValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // activityId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "Activity",
    //     key: "id",
    //   },
    // },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "User",
    //     key: "id",
    //   },
    // },
  },{
    timestamps: false
  });
};