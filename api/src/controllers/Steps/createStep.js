const { Paso } = require('../../db')


const createStep = async (req, res) =>{
    const { number, title, description, video, activityId } = req.body
    try {
        const newStep = await Paso.create({number, title, description, video, activityId})
        res.status(200).json(newStep)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {createStep}

