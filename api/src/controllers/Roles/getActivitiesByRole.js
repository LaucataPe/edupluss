const { Activity } = require('../../db')

const getActivitiesByRole = async (req, res) =>{
    const {roleId} = req.params
    try {
        const activities = await Activity.findAll({
            where: {
              roleId
            },
          });
        return res.status(200).json(activities)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getActivitiesByRole}