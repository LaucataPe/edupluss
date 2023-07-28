const { Activity } = require('../../db');

const updateActivity = async (req, res) => {
  const { id, title } = req.body;
  try {
    const getActivity = await Activity.findByPk(id)
    
    if(!getActivity) throw new Error('Actividad no encontrada')

    const updateActivity = await getActivity.update({
       title
    }, {
        where: {
            id
        }
    })

    res.status(200).json(updateActivity);

  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = { updateActivity };