const { Activity } = require('../../db')

const getEmpresaActivity = async (req, res) =>{
    const {empresaId} = req.params
    try {
        const activities = await Activity.findAll({
            where: {
              empresaId
            },
          });
        return res.status(200).json(activities)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getEmpresaActivity}