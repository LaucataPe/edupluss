const { Area } = require('../../db')

const getEmpresaAreas = async (req, res) =>{
  try {
      const {companyId} = req.params
      console.log(companyId);
        const areas = await Area.findAll({
            where: {
              companyId
            },
          });
        return res.status(200).json(areas)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getEmpresaAreas}