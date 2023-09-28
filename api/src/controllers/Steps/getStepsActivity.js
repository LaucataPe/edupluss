const { Step } = require('../../db');
const { catchedAsync } = require('../../utils');
const getStepsActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const steps = await Step.findAll({
      where: {
        activityId: id,
      },
    });
    const orderSteps = steps.sort((a, b) => a.number - b.number);

    return res.status(200).json(orderSteps);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getStepsActivity: catchedAsync(getStepsActivity) };
