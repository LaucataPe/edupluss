const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const postTestGrade = async (req, res) => {
  let { testWatched, activityId, userId } = req.body;
  
  try {
    const employeeUser = await User.findByPk(userId);

    if (employeeUser.tipo !== 'empleado') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an employee',
          400
        );
    } else {
        const previousTest = await TestGrade.findOne({
            where: {
                userId: userId,
                activityId: activityId,
            },
        });
        if (previousTest) {
            throw new Error("El empleado visualizó/realizó esta prueba anteriormente.");
        } else {
            const newTest = await TestGrade.create({ testWatched, activityId, userId });
            res.status(200).json(newTest);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { postTestGrade: catchedAsync(postTestGrade) };