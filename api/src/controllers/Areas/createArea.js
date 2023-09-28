const { Area } = require('../../db');
const { catchedAsync } = require('../../utils');
const createArea = async (req, res) => {
  const { name, companyId } = req.body;
  try {
    const newArea = await Area.create({ name, companyId, active: true });
    res.status(200).json(newArea);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createArea: catchedAsync(createArea) };
