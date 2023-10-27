const { Step } = require("../../db");
const { catchedAsync } = require("../../utils");

const updateStep = async (req, res) => {
  const { id, title, description, video, file, design } = req.body; 
  try {
    const getStep = await Step.findByPk(id);

    let currentVideo = video;
    if (video.length === 0 || !video) currentVideo = getStep.video;

    if (getStep) {
      const updateData = {
        title,
        description,
        video: currentVideo,
        file,
        design, 
      };

      const updatedStep = await getStep.update(updateData);

      res.status(200).json(updatedStep);
    } else {
      throw new Error("Este paso no fue encontrado");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateStep: catchedAsync(updateStep) };
