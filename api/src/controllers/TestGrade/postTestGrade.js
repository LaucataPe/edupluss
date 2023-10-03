const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const postTestGrade = async (req, res) => {
  let { gradeValue, activityId, userId } = req.body;
  
  try {
    const employeeUser = await User.findByPk(userId);

    if (employeeUser.tipo !== 'empleado') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an employee',
          400
        );
    } else {
        const previousGradeValue = await TestGrade.findAll({
            where: {
                userId: userId,
                activityId: activityId,
            },
        });
        if (previousGradeValue.length > 0) {
            throw new Error("El empleado realizó esta prueba anteriormente.");
        } else {
            const newGradeValue = await TestGrade.create({ gradeValue, activityId, userId });
            res.status(200).json(newGradeValue);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { postTestGrade: catchedAsync(postTestGrade) };