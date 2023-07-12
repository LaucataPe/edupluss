const { User, Area } = require('../../db')

const getUserAreas = async (req, res) =>{
    const {id} = req.params
    try {
        const findUser = await User.findByPk(id, {include: Area});
        if(!findUser) throw new Error('El usuario no existe')

        const areas = findUser.Areas.map(area => area.id); // Obtener solo los nombres de las dietas
        const allAreas =  await Area.findAll()

        if(allAreas){
            const userAreas = allAreas.filter(area => areas.includes(area.id));
            return res.status(200).json(userAreas)
        }

    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getUserAreas}