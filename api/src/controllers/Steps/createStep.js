const { Activity, Step } = require("../../db"); // Importa el modelo Activity
const { catchedAsync } = require("../../utils");

const createStep = async (req, res) => {
  const { title, description, video, activityId, file } = req.body;
  try {
    const activitySteps = await Step.findAll({ where: { activityId } });
    const stepsOrder = [...activitySteps].sort((a, b) => b.number - a.number);

    let nextNumber = 1;

    if (stepsOrder.length > 0) {
      nextNumber = stepsOrder[0].number + 1;
    }

    const newStep = await Step.create({
      number: nextNumber,
      title,
      description,
      video,
      file,
      activityId,
    });

    // Ahora actualiza el campo numberSteps en la actividad correspondiente
    const activity = await Activity.findByPk(activityId);
    if (activity) {
      activity.numberSteps += 1; // Aumenta el número de pasos en la actividad
      await activity.save(); // Guarda los cambios en la actividad
    }
    console.log(newStep)
    res.status(200).json(newStep);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createStep: catchedAsync(createStep) };
