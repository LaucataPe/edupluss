const { User } = require('../../db');

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const getUser = await User.findByPk(id)
    
    if(!getUser) throw new Error('Usuario no encontrado')
    
    await getUser.destroy()

    res.status(200).send('Usuario eliminado correctamente');
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { deleteUser };