const { UserStep } = require("../../db");
const { catchedAsync } = require("../../utils");

const getUserSteps = async (req, res) => {
  try {
    // Aquí puedes implementar la lógica para obtener los datos de UserSteps
    const userSteps = await UserStep.findAll();

    return res.status(200).json(userSteps);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getUserSteps: catchedAsync(getUserSteps) };
