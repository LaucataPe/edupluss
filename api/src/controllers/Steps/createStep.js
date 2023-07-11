const { Step } = require('../../db')
const cloudinary = require('../../utils/cloudinary')


const createStep = async (req, res) =>{
    const { number, title, description, video, activityId } = req.body
    console.log(req.body);
    try {
        /*const uploadVideo = await cloudinary.uploader.upload(video, {
           resource_type: 'video',
           folder: 'edupluss'
        })
        const urlVideo = uploadVideo.secure_url*/

        const newStep = await Step.create({number, title, description, 
            video, 
            activityId})
        res.status(200).json(newStep)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {createStep}

