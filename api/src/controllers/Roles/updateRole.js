const { Role, Area } = require('../../db');
const { catchedAsync } = require('../../utils');
const updateRole = async (req, res) => {
  const {
    id,
    name,
    hardSkills,
    softSkills,
    schedule,
    salary,
    experience,
    remote,
  } = req.body;
  try {
    const getRole = await Role.findByPk(id);

    if (getRole) {
      const updateRole = await getRole.update(
        {
          name,
          hardSkills,
          softSkills,
          salary,
          experience,
          remote,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json(updateRole);
    } else {
      throw new Error('Este rol/perfil no fue encontrado');
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateRole: catchedAsync(updateRole) };
