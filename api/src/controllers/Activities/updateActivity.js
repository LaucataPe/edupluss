const { catchedAsync } = require('../../utils');
const { validateUpdateActivity } = require('./activitySchema');
const patchActivity = require('./patchActivity');


const updateActivity = async (req, res) => {
  try {
    const validation = validateUpdateActivity(req.body);
  
    if(!validation.success){
      return res.status(400).json({message: validation.error.issues[0].message})
    }
  
    const { id } = req.body;
    const activityUpdated = await patchActivity(id, validation.data);
  
    if(typeof activityUpdated === "string"){
      return res.status(404).json({message: activityUpdated})
    }
  
    res.status(200).json(activityUpdated)
  } catch (error) {
    res.status(500).json({error: error})
  }

};

module.exports = { updateActivity: catchedAsync(updateActivity) };


// const { id, title } = req.body;
  // try {
  //   const getActivity = await Activity.findByPk(id);

  //   if (!getActivity) throw new Error('Actividad no encontrada');

  //   const updateActivity = await getActivity.update(
  //     {
  //       title,
  //     },
  //     {
  //       where: {
  //         id,
  //       },
  //     }
  //   );

  //   res.status(200).json(updateActivity);
  // } catch (error) {
  //   res.status(404).send(error.message);
  // }