const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const updateTestGrade = async (req, res) => {
  let { gradeValue, maximunGradeValue, activityId, userId } = req.body;
  
  try {
    const employeeUser = await User.findByPk(userId);

    if (employeeUser.tipo !== 'empleado') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an employee',
          400
        );
    } else {
        const test = await TestGrade.findOne({
            where: {
                userId: userId,
                activityId: activityId,
            },
        });
        if (!test) {
            return("El empleado aún no ha visto/realizado el cuestionario.");
        } else {
            if (employeeUser.tipo === 'empleado' && test.gradeValue && test.maximunGradeValue) {
                throw new Error("No se permite volver a cargar la puntuación de la prueba.")
            } else {
                const testUpdated = await TestGrade.update({ gradeValue, maximunGradeValue},{
                    where: {
                        id: test.id 
                    }
                });
                res.status(200).json(testUpdated);
            }
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateTestGrade: catchedAsync(updateTestGrade) };