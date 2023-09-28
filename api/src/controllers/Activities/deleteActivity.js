const { Activity, Step } = require('../../db');
const { catchedAsync } = require('../../utils');
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteActivity = await Activity.destroy({
      where: {
        id,
      },
    });
    const deleteSteps = await Step.destroy({
      where: {
        activityId: id,
      },
    });
    res.status(200).json(deleteActivity);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteActivity: catchedAsync(deleteActivity) };
