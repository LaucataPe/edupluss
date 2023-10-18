const { User, TestGrade } = require('../../db');
const { catchedAsync } = require('../../utils');
const { ClientError } = require("../../utils/index.js");

const deleteTestGrade = async (req, res) => {
  let { userId, id } = req.params;
  
  try {
    const adminUser = await User.findByPk(userId);
    console.log(adminUser);

    if (adminUser.tipo !== 'admin') {
        throw new ClientError(
          'incorrect request: the data sent does not correspond to an admin',
          400
        );
    } else {
        const test = await TestGrade.destroy({
            where: {
              id,
            },
        });
        if (!test) {
            throw new Error("No se ha encontrado el registro de Evaluación.");
        } else {
            res.status(200).json(test);
        }
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteTestGrade: catchedAsync(deleteTestGrade) };