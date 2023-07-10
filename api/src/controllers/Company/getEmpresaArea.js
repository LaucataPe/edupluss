const { Area } = require('../../db')

const getEmpresaAreas = async (req, res) =>{
    const {empresaId} = req.params
    try {
        const areas = await Area.findAll({
            where: {
              empresaId
            },
          });
        return res.status(200).json(areas)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getEmpresaAreas}