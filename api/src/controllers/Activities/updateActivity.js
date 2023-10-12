const { catchedAsync } = require('../../utils');
const { validateUpdateActivity } = require('./activitySchema');
const patchActivity = require('./patchActivity');
const { Activity } = require("../../db");


const updateActivity = async (req, res) => {
  try {
    // const validation = validateUpdateActivity(req.body);
  
    // if(!validation.success){
    //   return res.status(400).json({message: validation.error.issues[0].message})
    // }
    // const activityUpdated = await patchActivity(id, validation.data);
  
    // if(typeof activityUpdated === "string"){
    //   return res.status(404).json({message: activityUpdated})
    // }
  
    const { id,title } = req.body;
    const updateActivity = await Activity.update({title},{where:{id}})
  
    res.status(200).json(updateActivity[0])
  } catch (error) {
    res.status(500).json({error: error})
  }

};

module.exports = { updateActivity: catchedAsync(updateActivity) };
