const { Role, Area } = require('../../db');

const createRole = async (req, res) => {
  const { name, hardSkills, softSkills, schedule, salary, experience, remote, areaId } = req.body;
  try {
    const area = await Area.findByPk(areaId)
    if(area){
      const newRole = await Role.create({ name, hardSkills, softSkills, schedule, salary, 
        experience, remote, areaId,
        companyId: area.companyId });
      res.status(200).json(newRole);
    }else{
      throw new Error("No se encontró el área especificada");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { createRole };

