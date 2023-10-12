const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const getTestGrade = async (req, res) => {
  let { activityId, userId } = req.query;
  
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
        console.log(test);
        if (!test) {
            throw new Error("El empleado aún no ha visto/realizado esta prueba.");
        } else {
            res.status(200).json(test);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { getTestGrade: catchedAsync(getTestGrade) };