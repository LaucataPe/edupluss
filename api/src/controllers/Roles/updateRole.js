const { Role, Area } = require('../../db');

const updateRole = async (req, res) => {
  const { id, name, hardskills, softskills, schedule, salary, experience, remote } = req.body;
  try {
    const getRole = Role.findByPk(id)

    if(getRole){
        const updateRole = await getRole.update({ name, hardskills, softskills, schedule, salary, 
            experience, remote});
          res.status(200).json(updateRole);
    }else{
        throw new Error('Este rol/perfil no fue encontrado')
    }
    
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateRole };

