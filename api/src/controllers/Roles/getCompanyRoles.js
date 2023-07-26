const { Role, Area } = require('../../db');

const getCompanyRoles = async (req, res) => {
  const { companyId } = req.params;
  try {
    // Buscar todas las áreas asociadas a la compañía
    const areas = await Area.findAll({
      where: {
        companyId,
      },
      include: [
        {
          model: Role, // Incluir los roles asociados a cada área
        },
      ],
    });

    // Recorrer las áreas y extraer los roles
    const roles = areas.flatMap((area) => area.Roles);

    return res.status(200).json(roles);
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

module.exports = { getCompanyRoles };
