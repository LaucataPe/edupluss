const { User, Area } = require('../../db')

const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({ include: Area });
  
      // Transformar los datos para excluir la información de User_Areas
      const transformedUsers = users.map((user) => {
        const areas = user.Areas.map((area) => {
          return {
            id: area.id,
            name: area.name,
            active: area.active,
            companyId: area.companyId
          };
        });
  
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          active: user.active,
          tipo: user.tipo,
          companyId: user.companyId,
          areas: areas
        };
      });
  
      return res.status(200).json(transformedUsers);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
  
  module.exports = { getAllUsers };
  

module.exports = {getAllUsers}