const { Activity } = require('../../db');

const createActivity = async (req, res) => {
  const { title, areaId } = req.body;
  try {
    const newActivity = await Activity.create({ title, areaId, active: true });
    res.status(200).json(newActivity);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createActivity };

