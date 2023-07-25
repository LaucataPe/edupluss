const { Role } = require('../../db')

const getRolesByArea = async (req, res) =>{
    const {areaId} = req.params
    try {
        const roles = await Role.findAll({
            where: {
              areaId
            },
          });
        return res.status(200).json(roles)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getRolesByArea}