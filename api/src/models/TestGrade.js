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
      allowNull: true
    },
    maximunGradeValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    testWatched: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    errorTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
   /*  activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Activity",
        key: "id",
      },
    }, */
    /* userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    }, */
  },{
    timestamps: false
  });
};
