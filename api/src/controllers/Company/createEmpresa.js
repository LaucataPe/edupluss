const { Company } = require('../../db');
const { catchedAsync } = require('../../utils');

const createCompany = async (req, res) => {
  const { name, nit } = req.body;
  try {
    const newCompany = await Company.create({ name, nit, active: true });
    res.status(200).json(newCompany);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createCompany: catchedAsync(createCompany) };
