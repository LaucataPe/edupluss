const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getGradesOfAllEmployeesByActivity = async (req, res) => {
  let { adminId, activityId } = req.body;
  
  try {
    const adminUser = await User.findByPk(adminId);

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const testGradesByActivity = await TestGrade.findAll({
            where: {
                activityId: activityId,
            },
            attributes: ['id', "gradeValue", "maximunGradeValue" ]
        });
        if (testGradesByActivity.length === 0) {
            throw new Error("Los empleados aún no han realizado la evaluación de esta actividad.");
        } else {
            res.status(200).json(testGradesByActivity);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getGradesOfAllEmployeesByActivity: catchedAsync(getGradesOfAllEmployeesByActivity) };