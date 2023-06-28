const { Activity, Paso } = require('../../db')

const deleteActivity = async (req, res) =>{
    const {id} = req.params
    try {
        const deleteActivity = await Activity.destroy({
            where: {
              id
            }
          });   
        const deletePasos = await Paso.destroy({
            where: {
              activityId: id
            }
          });   
        res.status(200).json(deleteActivity)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {deleteActivity}
