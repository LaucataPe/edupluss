const { Step } = require('../../db');
const cloudinary = require('../../utils/cloudinary')
const regExpurl = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)");

const updateStep = async (req, res) => {
  const {id, title, description, video, file } = req.body
  try {
    const getStep = await Step.findByPk(id)

    let currentVideo = video
    if(video.length === 0 || !video) currentVideo = getStep.video

    if(!regExpurl.test(video) && video.startsWith("data:video/")){
      const uploadVideo = await cloudinary.uploader.upload(video, {
          resource_type: 'video',
          folder: 'edupluss'
       })
       currentVideo = uploadVideo.secure_url
  }

    if(getStep ){
        const updateStep = await getStep.update({title, description, video: currentVideo, file}, {
           where: {
               id
           }
       })
          res.status(200).json(updateStep);
    }else{
        throw new Error('Este paso no fue encontrado')
    }
    
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateStep };

