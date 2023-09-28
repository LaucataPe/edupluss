const { Step } = require('../../db');
const { catchedAsync } = require('../../utils');

const deleteStep = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteStep = await Step.destroy({
      where: {
        id,
      },
    });
    res.status(200).json(deleteStep);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteStep: catchedAsync(deleteStep) };
