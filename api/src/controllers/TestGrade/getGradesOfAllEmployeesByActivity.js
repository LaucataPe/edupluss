const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getGradesOfAllEmployeesByActivity = async (req, res) => {
  let { adminId, activityId } = req.params;
  
  try {
    const adminUser = await User.findByPk(adminId);

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        let totalGradeValue = 0;
        let totalMaximunGradeValue = 0;

        const testGrades = await TestGrade.findAll({
            where: {
                activityId: activityId,
            },
            attributes: ['id', "gradeValue", "maximunGradeValue" ]
        });
        if (testGrades.length === 0) {
            throw new Error("Los empleados aún no han realizado la evaluación de esta actividad.");
        } else {
          for (const testGrade of testGrades) {
            totalGradeValue += testGrade.gradeValue;
            totalMaximunGradeValue += testGrade.maximunGradeValue;
          }
            const gradePercentage = parseFloat(((totalGradeValue / totalMaximunGradeValue) * 100).toFixed(2));

            res.status(200).json(gradePercentage);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getGradesOfAllEmployeesByActivity: catchedAsync(getGradesOfAllEmployeesByActivity) };