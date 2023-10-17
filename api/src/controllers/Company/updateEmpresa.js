const { Company } = require("../../db");
const { validateUpdateCompany } = require("./companySchema");

const updateEmpresa = async (req, res) => {
  try {
    const validation = validateUpdateCompany(req.body);

    if (!validation.success) {
      return res.status(404).json({ message: validation });
    }

    const { id } = req.body;
    const companyFound = await Company.findByPk(id);

    if (!companyFound) {
      return res
        .status(404)
        .json({ message: `No existe empresa con id: ${id}` });
    }

    companyFound.set(validation.data).save();

    return res.status(200).json({ message: companyFound });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = updateEmpresa;
