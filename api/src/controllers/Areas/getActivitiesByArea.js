const { Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const getActivitiesByArea = async (req, res) => {
  const { areaId } = req.params;
  try {
    const activities = await Activity.findAll({
      where: {
        areaId,
      },
    });
    return res.status(200).json(activities);
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

module.exports = { getActivitiesByArea: catchedAsync(getActivitiesByArea) };
