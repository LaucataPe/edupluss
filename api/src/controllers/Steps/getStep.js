const { Step } = require("../../db");
const { catchedAsync } = require("../../utils");

const getAllSteps = catchedAsync(async (req, res) => {
  try {
    const steps = await Step.findAll();

    if (steps.length === 0) {
      res.status(404).json({ message: "No se encontraron pasos." });
    } else {
      res.status(200).json(steps);
    }
  } catch (error) {
    res.status(500).json({
      message: "Ocurrió un error al obtener los pasos.",
      error: error.message,
    });
  }
});

module.exports = { getAllSteps: (getAllSteps) };
