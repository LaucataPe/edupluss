const { Activity, Step } = require("../../db");
const { catchedAsync } = require("../../utils");

const deleteStep = async (req, res) => {
  const { id } = req.params;
  try {
    const step = await Step.findByPk(id);
    if (!step) {
      return res.status(404).json({ error: "Step not found" });
    }

    const activity = await Activity.findByPk(step.activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (activity.numberSteps > 0) {
      activity.numberSteps -= 1;
      await activity.save();
    }

    await Step.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Step deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { deleteStep: catchedAsync(deleteStep) };
