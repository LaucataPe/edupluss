const { User, TestGrade, Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getAllTestGradesByUser = async (req, res) => {
  let { employeeId } = req.params;
  
  try {
    const employeeUser = await User.findByPk(employeeId);

    if (employeeUser.tipo !== 'empleado') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an employee',
          400
        );
    } else {
        const testGrades = await TestGrade.findAll({
            where: {
                userId: employeeId,
            },
            attributes: ['id', "gradeValue", "maximunGradeValue" ],
            include: [
              {
                model: Activity,
                attributes: ['id'],
              },
            ],
        });
        if (testGrades.length === 0) {
            throw new Error("El empleado aún no ha visto/realizado alguna prueba.");
        } else {
            res.status(200).json(testGrades);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getAllTestGradesByUser: catchedAsync(getAllTestGradesByUser) };