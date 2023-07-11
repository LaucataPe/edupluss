const { Area } = require('../../db')
const {getActivitiesByArea} = require('../Areas/getActivitiesByArea')

const getEmpresaAreas = async (req, res) =>{
  try {
      const {companyId} = req.params
      console.log(companyId);
        const areas = await Area.findAll({
            where: {
              companyId
            },
          });
        const activities = areas.map(area => {
          
        });
        return res.status(200).json(areas)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getEmpresaAreas}