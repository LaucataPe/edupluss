const { Activity } = require('../../db')

const getCompanyActivities = async (req, res) =>{
    const {companyId} = req.params
    try {
        const activities = await Activity.findAll({
            where: {
              companyId
            },
          });
        return res.status(200).json(activities)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

module.exports = {getCompanyActivities}