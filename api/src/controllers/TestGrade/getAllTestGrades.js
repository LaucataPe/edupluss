const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getAllTestGrades = async (req, res) => {
  let { adminId, employeeId } = req.body;
  
  try {
    const adminUser = await User.findByPk(adminId);

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const testGrades = await TestGrade.findAll({
            where: {
                userId: employeeId,
            },
            attributes: ['id', "gradeValue", "maximunGradeValue" ]
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

module.exports = { getAllTestGrades: catchedAsync(getAllTestGrades) };