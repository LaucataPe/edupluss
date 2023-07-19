const { User } = require('../../db');
const { encrypt } = require('../../utils/bcryptHandler');

const updateUser = async (req, res) => {
  const { id, username, email, password, tipo, areas, active } = req.body;

  try {
    const getUser = await User.findByPk(id)
    
    if(!getUser) throw new Error('Usuario no encontrado')

    const passwordHash = await encrypt(password);

    const updateUser = await getUser.update({
        username, email, 
        password: passwordHash, tipo, active
    }, {
        where: {
            id
        }
    })

    if(tipo === 'admin'){
      // Eliminar todas las áreas relacionadas al usuario
      await updateUser.setAreas([]);
    }else{
      // Obtener las áreas actuales del usuario
      const currentAreas = await updateUser.getAreas();

      // Buscar las áreas a agregar
      const areasToAdd = areas.filter(areaId => !currentAreas.some(area => area.id === areaId.id));

      // Buscar las áreas a eliminar
      const areasToRemove = currentAreas.filter(area => !areas.includes(area.id));

      // Agregar las nuevas áreas al usuario
      await updateUser.addAreas(areasToAdd);

      // Eliminar las áreas que ya no se necesitan
      await updateUser.removeAreas(areasToRemove);
    }
    
    res.status(200).json(updateUser);

  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateUser };