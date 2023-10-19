const { User, Role, Company, Activity, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getEmployeesAndGrades = async (req, res) => {
  let  { adminId, activityId }  = req.params;
  
  try {
      const adminUser = await User.findByPk(adminId);
      console.log(adminUser);
    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const activity = await Activity.findOne({where: {
          id: activityId
        }});

        const testGrades = await TestGrade.findAll({
            where: { activityId: activityId },
        });

        const userPromises = testGrades.map((testGrade) => {
          return User.findOne({
            attributes: ['id', 'username', 'email'],
            where: { id: testGrade.userId },
          });
        });
      
        const users = await Promise.all(userPromises);

        let totalGradeValue = 0;
        let totalMaximunGradeValue = 0;
        let gradePercentage = 0;

        for (const testGrade of testGrades) {
          totalGradeValue += testGrade.gradeValue;
          totalMaximunGradeValue += testGrade.maximunGradeValue;
        }
        
        if(totalGradeValue === 0){
          gradePercentage = 0;
        } else {
          gradePercentage = parseFloat(((totalGradeValue / totalMaximunGradeValue) * 100).toFixed(2));
        }
    
        const percentage = {
          gradePercentage: gradePercentage,
          activityName: activity.title
        }
      
        // const result = testGrades.map((testGrade, index) => ({
        //   TestGrade: testGrade,
        //   User: users[index],
        // }));
        // result.unshift(percentage)

        const result = testGrades.map((testGrade, index) => (
          {
            idUser: users[index].id,
            username: users[index].username,
            email: users[index].email,
            idTestGrade: testGrade.id,
            gradeValue: testGrade.gradeValue,
            maximunGradeValue: testGrade.maximunGradeValue,
            testWatched: testGrade.testWatched,
            errorTest: testGrade.errorTest,
            activityId: testGrade.activityId,
         }
        ));
        result.unshift(percentage)
        res.status(200).json(result);
       
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getEmployeesAndGrades: catchedAsync(getEmployeesAndGrades) };

