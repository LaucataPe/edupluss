const { Activity } = require('../../db');
const { catchedAsync } = require('../../utils');
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    return res.status(200).json(activities);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getAllActivities: catchedAsync(getAllActivities) };
