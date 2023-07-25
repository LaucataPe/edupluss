const { Role } = require('../../db');

const deleteRole = async (req, res) => {
  const { id } = req.query;

  try {
    const getRole = await Role.findByPk(id)
    
    if(!getRole) throw new Error('Rol/perfil no encontrado')
    
    await getRole.destroy()

    res.status(200).send('Rol eliminado correctamente');
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteRole };