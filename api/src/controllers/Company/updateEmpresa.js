const { Company, User } = require("../../db");
const { validateUpdateCompany } = require("./companySchema");

const updateEmpresa = async (req, res) => {
  try {
    const validation = validateUpdateCompany(req.body);

    if (!validation.success) {
      return res.status(404).json({ message: validation });
    }

    const { id, active } = req.body;
    const companyFound = await Company.findByPk(id);

    if (!companyFound) {
      return res
        .status(404)
        .json({ message: `No existe empresa con id: ${id}` });
    }
    
    const usersToChangeActive = await User.findAll({
      where: {
        companyId: id,
      },
    });
    if(usersToChangeActive){
      const promises = usersToChangeActive.map(async (user) => {
        await User.update(
          { active: active },
          {
            where: {
              id: user.id
            }
          }
        );
      });
      await Promise.all(promises);
    }

    companyFound.set(validation.data).save();

    return res.status(200).json(companyFound);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = updateEmpresa;
