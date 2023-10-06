const { Company } = require('../../db');
const { catchedAsync } = require('../../utils');
const getAllCompanies = async (req, res) => {
  console.log("soy empresas",req.userId)
  console.log("soy userROle",req.userRole)
  try {
    const companies = await Company.findAll();
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getAllCompanies: catchedAsync(getAllCompanies) };
