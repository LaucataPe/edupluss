const { Activity, Step } = require("../../db");
const { catchedAsync } = require("../../utils");
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const stepsToDelete = await Step.findAll({
      where: {
        activityId: id,
      },
    });

    for (const Step of stepsToDelete) {
      await Step.destroy();
    }

    const deleteActivity = await Activity.destroy({
      where: {
        id,
      },
    });
    
    res.status(200).json(deleteActivity);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteActivity: catchedAsync(deleteActivity) };
