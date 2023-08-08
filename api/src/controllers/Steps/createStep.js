const { Step } = require('../../db')
const cloudinary = require('../../utils/cloudinary')
const regExpurl = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)");

const createStep = async (req, res) =>{
    const {title, description, video, activityId, file } = req.body
    try {
        let urlVideo = video

        if(!regExpurl.test(video) && video.startsWith("data:video/")){
            const uploadVideo = await cloudinary.uploader.upload(video, {
                resource_type: 'video',
                folder: 'edupluss'
             })
             urlVideo = uploadVideo.secure_url
        }

        const activitySteps = await Step.findAll({ where: { activityId } });
        const stepsOrder = [...activitySteps].sort((a, b) => b.number - a.number)

        let nextNumber = 1;

        if(stepsOrder.length > 0){
            nextNumber = stepsOrder[0].number + 1
          }

        const newStep = await Step.create({number: nextNumber, title, description, 
            video: urlVideo, file,
            activityId})
        res.status(200).json(newStep)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

module.exports = {createStep}

